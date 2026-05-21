#!/usr/bin/env bash
# Sodiq School - Ubuntu 22.04 deploy (root)
# Usage on a fresh Ubuntu 22.04 server (run as root):
#   bash <(curl -fsSL https://raw.githubusercontent.com/mexriddin1/sodiq-school/main/deploy/ubuntu-server-setup.sh)
#
# Or upload the file and:
#   chmod +x ubuntu-server-setup.sh && ./ubuntu-server-setup.sh

set -euo pipefail

# ---------- Config ----------
REPO_URL="https://github.com/mexriddin1/sodiq-school.git"
APP_ROOT="/opt/sodiq-school"
DB_NAME="sodiq_school"
NODE_MAJOR="20"
CRED_FILE="/root/sodiq-credentials.txt"

ADMIN_EMAIL_DEFAULT="developer@gmail.com"
ADMIN_NAME_DEFAULT="Developer"

# ---------- Helpers ----------
c_cyan="\033[1;36m"; c_green="\033[1;32m"; c_yellow="\033[1;33m"; c_red="\033[1;31m"; c_off="\033[0m"
step()  { echo -e "\n${c_cyan}==> $*${c_off}"; }
ok()    { echo -e "${c_green}OK${c_off} $*"; }
warn()  { echo -e "${c_yellow}WARN${c_off} $*"; }
die()   { echo -e "${c_red}ERROR${c_off} $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Run as root."

# Non-interactive apt
export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

# ---------- 0. Detect public IP ----------
step "Detecting public IP..."
SERVER_IP="$(curl -fsSL https://api.ipify.org || true)"
[[ -z "${SERVER_IP}" ]] && SERVER_IP="$(hostname -I | awk '{print $1}')"
ok "Server IP: ${SERVER_IP}"

# ---------- 1. Generate passwords ----------
step "Generating passwords and secrets..."
# Use openssl to avoid SIGPIPE issues with `tr | head` under `set -o pipefail`.
MYSQL_ROOT_PASS="$(openssl rand -hex 12)"   # 24 hex chars
ADMIN_PASSWORD="$(openssl rand -hex 8)"     # 16 hex chars
JWT_SECRET="$(openssl rand -hex 32)"        # 64 hex chars
ADMIN_EMAIL="${ADMIN_EMAIL:-$ADMIN_EMAIL_DEFAULT}"
ADMIN_NAME="${ADMIN_NAME:-$ADMIN_NAME_DEFAULT}"

# ---------- 2. apt update + base packages ----------
step "Updating apt and installing base packages..."
apt-get update -y
apt-get install -y curl ca-certificates gnupg lsb-release git build-essential ufw openssl

# ---------- 3. Node.js 20 (NodeSource) ----------
step "Installing Node.js ${NODE_MAJOR}.x..."
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | sed 's/v//;s/\..*//')" != "${NODE_MAJOR}" ]]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
ok "Node $(node -v), npm $(npm -v)"

# ---------- 4. MySQL 8 ----------
step "Installing MySQL Server 8..."
apt-get install -y mysql-server
systemctl enable --now mysql

step "Configuring MySQL root password and database..."
# Ubuntu 22 fresh install: root uses auth_socket on localhost; switch to native password.
mysql --protocol=socket -uroot <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASS}';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SQL
ok "MySQL configured."

# Make sure MySQL only listens on localhost
if grep -q "^bind-address" /etc/mysql/mysql.conf.d/mysqld.cnf; then
  sed -i 's/^bind-address.*/bind-address = 127.0.0.1/' /etc/mysql/mysql.conf.d/mysqld.cnf
  systemctl restart mysql
fi

# ---------- 5. PM2 ----------
step "Installing PM2 globally..."
npm install -g pm2@latest
ok "PM2 $(pm2 -v)"

# ---------- 6. Clone repo ----------
step "Cloning repo to ${APP_ROOT}..."
if [[ -d "${APP_ROOT}/.git" ]]; then
  git -C "${APP_ROOT}" fetch --all
  git -C "${APP_ROOT}" reset --hard origin/main
else
  rm -rf "${APP_ROOT}"
  git clone --depth 1 "${REPO_URL}" "${APP_ROOT}"
fi

# ---------- 7. .env files ----------
step "Writing .env files..."
CLIENT_ORIGIN="http://${SERVER_IP}:3000"
ADMIN_ORIGIN="http://${SERVER_IP}:3001"
PUBLIC_API_URL="http://${SERVER_IP}:4000"

cat > "${APP_ROOT}/backend/.env" <<EOF
PORT=4000
NODE_ENV=production
CLIENT_ORIGIN=${CLIENT_ORIGIN}
ADMIN_ORIGIN=${ADMIN_ORIGIN}

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=${MYSQL_ROOT_PASS}
DB_NAME=${DB_NAME}

JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

SEED_ADMIN_EMAIL=${ADMIN_EMAIL}
SEED_ADMIN_PASSWORD=${ADMIN_PASSWORD}
SEED_ADMIN_NAME=${ADMIN_NAME}

UPLOAD_DIR=uploads
PUBLIC_BASE_URL=${PUBLIC_API_URL}
EOF
chmod 600 "${APP_ROOT}/backend/.env"

INTERNAL_API_URL="http://127.0.0.1:4000"

# client-site/src/lib/api.ts uses INTERNAL_API_BASE_URL during SSR/build to hit
# the backend over loopback, avoiding ECONNREFUSED on the public IP during
# prerender. NEXT_PUBLIC_API_BASE_URL is what gets baked into browser bundles.
cat > "${APP_ROOT}/client-site/.env.production" <<EOF
NEXT_PUBLIC_API_BASE_URL=${PUBLIC_API_URL}
INTERNAL_API_BASE_URL=${INTERNAL_API_URL}
EOF
cat > "${APP_ROOT}/admin-site/.env.production" <<EOF
NEXT_PUBLIC_API_BASE_URL=${PUBLIC_API_URL}
INTERNAL_API_BASE_URL=${INTERNAL_API_URL}
EOF

# ---------- 8. Install dependencies ----------
# npm ci is strict about package-lock vs package.json sync. If the lock
# is stale (common during fast iteration), fall back to npm install.
npm_install() {
  if ! npm ci $1; then
    warn "npm ci failed (lock out of sync?), falling back to npm install"
    npm install $1
  fi
}
export -f npm_install warn
export c_yellow c_off

step "Backend: npm ci..."
( cd "${APP_ROOT}/backend"     && npm_install "--omit=dev" )

step "Client-site: npm install..."
( cd "${APP_ROOT}/client-site" && npm_install "" )

step "Admin-site: npm install..."
( cd "${APP_ROOT}/admin-site"  && npm_install "" )

# ---------- 9. DB migrate + seed + start backend ----------
step "Migrating + seeding database..."
( cd "${APP_ROOT}/backend" && npm run db:reset )

step "Starting backend with PM2 (needed before Next.js prerender)..."
pm2 delete all >/dev/null 2>&1 || true
pm2 start npm --name sodiq-backend --cwd "${APP_ROOT}/backend" -- start

step "Waiting for backend on ${INTERNAL_API_URL}..."
for i in $(seq 1 60); do
  if curl -fsS -o /dev/null --max-time 2 "${INTERNAL_API_URL}/" \
     || curl -fsS -o /dev/null --max-time 2 "${INTERNAL_API_URL}/health" \
     || curl -fsS -o /dev/null --max-time 2 "${INTERNAL_API_URL}/api/health"; then
    ok "Backend reachable after ${i}s"
    break
  fi
  sleep 1
  [[ $i -eq 60 ]] && { pm2 logs sodiq-backend --lines 50 --nostream || true; die "Backend did not come up"; }
done

# ---------- 10. Build front-ends (now backend is live for prerender) ----------
step "Client-site: build..."
( cd "${APP_ROOT}/client-site" && npm run build )

step "Admin-site: build..."
( cd "${APP_ROOT}/admin-site" && npm run build )

# ---------- 11. PM2: start front-ends ----------
step "Starting client + admin with PM2..."
pm2 start npm --name sodiq-client --cwd "${APP_ROOT}/client-site" -- start
pm2 start npm --name sodiq-admin  --cwd "${APP_ROOT}/admin-site"  -- start

pm2 save

step "Enabling PM2 systemd startup..."
pm2 startup systemd -u root --hp /root | tail -n 1 | bash || warn "pm2 startup install returned non-zero"
pm2 save

# ---------- 11. Firewall ----------
step "Configuring UFW firewall..."
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 22/tcp  >/dev/null 2>&1 || true
ufw allow 80/tcp  >/dev/null 2>&1 || true
ufw allow 443/tcp >/dev/null 2>&1 || true
ufw allow 3000/tcp >/dev/null 2>&1 || true
ufw allow 3001/tcp >/dev/null 2>&1 || true
ufw allow 4000/tcp >/dev/null 2>&1 || true
yes | ufw enable >/dev/null 2>&1 || true
ufw status verbose || true

# ---------- 12. Save credentials ----------
step "Saving credentials to ${CRED_FILE}..."
cat > "${CRED_FILE}" <<EOF
Sodiq School deployment credentials  ($(date -Iseconds))
=========================================================

Server IP        : ${SERVER_IP}

Client site URL  : ${CLIENT_ORIGIN}
Admin panel URL  : ${ADMIN_ORIGIN}/login
Backend API URL  : ${PUBLIC_API_URL}

Admin email      : ${ADMIN_EMAIL}
Admin password   : ${ADMIN_PASSWORD}
Admin name       : ${ADMIN_NAME}

MySQL root pass  : ${MYSQL_ROOT_PASS}
MySQL database   : ${DB_NAME}

JWT secret (64x) : ${JWT_SECRET}

App root         : ${APP_ROOT}
backend/.env     : ${APP_ROOT}/backend/.env
EOF
chmod 600 "${CRED_FILE}"

# ---------- 13. Done ----------
echo ""
echo -e "${c_green}============================================================${c_off}"
echo -e "${c_green} DEPLOY COMPLETE${c_off}"
echo -e "${c_green}============================================================${c_off}"
echo ""
echo "  Client site :  ${CLIENT_ORIGIN}"
echo "  Admin panel :  ${ADMIN_ORIGIN}/login"
echo "  Backend API :  ${PUBLIC_API_URL}"
echo ""
echo "  Admin email     :  ${ADMIN_EMAIL}"
echo "  Admin password  :  ${ADMIN_PASSWORD}"
echo "  MySQL root pass :  ${MYSQL_ROOT_PASS}"
echo ""
echo "  Credentials saved to: ${CRED_FILE}"
echo ""
echo "  pm2 status         # check processes"
echo "  pm2 logs           # tail all logs"
echo "  pm2 restart all    # restart everything"
echo ""
echo -e "${c_green}============================================================${c_off}"
