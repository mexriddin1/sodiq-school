#!/usr/bin/env bash
# One-shot resume of the partially-failed Ubuntu deploy.
# Key change vs the original script: bring backend UP before building client/
# admin, because Next.js prerenders pages by fetching the API at build time.
set -euo pipefail

APP_ROOT=/opt/sodiq-school
SERVER_IP=176.101.56.242
INTERNAL_API=http://127.0.0.1:4000

c_cyan="\033[1;36m"; c_off="\033[0m"
step() { echo -e "\n${c_cyan}==> $*${c_off}"; }

step "Patch front-end .env.production with INTERNAL_API_BASE_URL"
for d in client-site admin-site; do
  f="${APP_ROOT}/${d}/.env.production"
  grep -q "^INTERNAL_API_BASE_URL=" "$f" || echo "INTERNAL_API_BASE_URL=${INTERNAL_API}" >> "$f"
done

step "DB migrate + seed"
cd "${APP_ROOT}/backend"
npm run db:reset

step "PM2 start backend"
pm2 delete all >/dev/null 2>&1 || true
pm2 start npm --name sodiq-backend --cwd "${APP_ROOT}/backend" -- start

step "Wait for backend on ${INTERNAL_API}"
for i in $(seq 1 60); do
  if curl -fsS -o /dev/null --max-time 2 "${INTERNAL_API}/health" \
     || curl -fsS -o /dev/null --max-time 2 "${INTERNAL_API}/" \
     || curl -fsS -o /dev/null --max-time 2 "${INTERNAL_API}/api/health"; then
    echo "backend up after ${i}s"
    break
  fi
  sleep 1
  if [[ $i -eq 60 ]]; then
    echo "backend did not respond within 60s — recent backend logs:"
    pm2 logs sodiq-backend --lines 50 --nostream || true
    exit 1
  fi
done

step "Client: npm install + build"
cd "${APP_ROOT}/client-site"
npm install --no-audit --no-fund
INTERNAL_API_BASE_URL="${INTERNAL_API}" npm run build

step "Admin: npm install + build"
cd "${APP_ROOT}/admin-site"
npm install --no-audit --no-fund
INTERNAL_API_BASE_URL="${INTERNAL_API}" npm run build

step "PM2 start client + admin"
pm2 start npm --name sodiq-client --cwd "${APP_ROOT}/client-site" -- start
pm2 start npm --name sodiq-admin  --cwd "${APP_ROOT}/admin-site"  -- start
pm2 save

step "PM2 systemd"
pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true
pm2 save

step "UFW"
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 22/tcp  >/dev/null 2>&1 || true
ufw allow 80/tcp  >/dev/null 2>&1 || true
ufw allow 443/tcp >/dev/null 2>&1 || true
ufw allow 3000/tcp >/dev/null 2>&1 || true
ufw allow 3001/tcp >/dev/null 2>&1 || true
ufw allow 4000/tcp >/dev/null 2>&1 || true
yes | ufw enable >/dev/null 2>&1 || true
ufw status verbose

step "Save credentials"
MYSQL_ROOT_PASS="$(grep -E '^DB_PASSWORD=' ${APP_ROOT}/backend/.env | cut -d= -f2-)"
ADMIN_EMAIL="$(grep -E '^SEED_ADMIN_EMAIL=' ${APP_ROOT}/backend/.env | cut -d= -f2-)"
ADMIN_PASSWORD="$(grep -E '^SEED_ADMIN_PASSWORD=' ${APP_ROOT}/backend/.env | cut -d= -f2-)"
ADMIN_NAME="$(grep -E '^SEED_ADMIN_NAME=' ${APP_ROOT}/backend/.env | cut -d= -f2-)"
JWT_SECRET="$(grep -E '^JWT_SECRET=' ${APP_ROOT}/backend/.env | cut -d= -f2-)"

cat > /root/sodiq-credentials.txt <<EOF
Sodiq School deployment credentials  ($(date -Iseconds))
=========================================================

Server IP        : ${SERVER_IP}

Client site URL  : http://${SERVER_IP}:3000
Admin panel URL  : http://${SERVER_IP}:3001/login
Backend API URL  : http://${SERVER_IP}:4000

Admin email      : ${ADMIN_EMAIL}
Admin password   : ${ADMIN_PASSWORD}
Admin name       : ${ADMIN_NAME}

MySQL root pass  : ${MYSQL_ROOT_PASS}
MySQL database   : sodiq_school

JWT secret       : ${JWT_SECRET}

App root         : ${APP_ROOT}
backend/.env     : ${APP_ROOT}/backend/.env
EOF
chmod 600 /root/sodiq-credentials.txt
echo
echo "==> DONE"
