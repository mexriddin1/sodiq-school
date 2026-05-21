#!/usr/bin/env bash
# Sodiq School - domain + HTTPS setup for Ubuntu 22.04.
# Wires sodiqschool.uz / www / admin / api through Nginx reverse proxy,
# obtains Let's Encrypt certs, updates .env files, rebuilds front-ends,
# and restarts PM2.
#
# Run as root after DNS A records are pointing at this server.
set -euo pipefail

APP_ROOT=/opt/sodiq-school
DOMAIN_ROOT=sodiqschool.uz
DOMAIN_WWW=www.sodiqschool.uz
DOMAIN_ADMIN=admin.sodiqschool.uz
DOMAIN_API=api.sodiqschool.uz

CERTBOT_EMAIL="${CERTBOT_EMAIL:-developer@gmail.com}"

PUBLIC_CLIENT="https://${DOMAIN_ROOT}"
PUBLIC_ADMIN="https://${DOMAIN_ADMIN}"
PUBLIC_API="https://${DOMAIN_API}"
INTERNAL_API="http://127.0.0.1:4000"

c_cyan="\033[1;36m"; c_green="\033[1;32m"; c_yellow="\033[1;33m"; c_red="\033[1;31m"; c_off="\033[0m"
step()  { echo -e "\n${c_cyan}==> $*${c_off}"; }
ok()    { echo -e "${c_green}OK${c_off} $*"; }
warn()  { echo -e "${c_yellow}WARN${c_off} $*"; }
die()   { echo -e "${c_red}ERROR${c_off} $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Run as root."
export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

# ---------- 0. DNS sanity ----------
step "Verifying DNS A records point to this server..."
MY_IP="$(curl -fsSL https://api.ipify.org || hostname -I | awk '{print $1}')"
ok "Server IP: ${MY_IP}"
for h in "${DOMAIN_ROOT}" "${DOMAIN_WWW}" "${DOMAIN_ADMIN}" "${DOMAIN_API}"; do
  RESOLVED="$(getent ahostsv4 "$h" | awk 'NR==1{print $1}')"
  if [[ "$RESOLVED" != "$MY_IP" ]]; then
    warn "$h resolves to '${RESOLVED:-<nothing>}' (expected $MY_IP) — Let's Encrypt may fail"
  else
    ok "$h -> $RESOLVED"
  fi
done

# ---------- 1. Install Nginx + certbot ----------
step "Installing Nginx + certbot..."
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable --now nginx

# ---------- 2. Write HTTP-only Nginx config ----------
# certbot --nginx will append the SSL config blocks itself.
step "Raising server_names_hash_bucket_size (default 32 is too small)..."
# Uncomment the directive that Ubuntu's nginx.conf already ships, commented.
# A separate conf.d file collides with certbot --nginx's internal http-01
# challenge config (which sees the directive twice and errors out).
rm -f /etc/nginx/conf.d/server-names.conf
sed -i 's/^[[:space:]]*#[[:space:]]*server_names_hash_bucket_size 64;.*/\tserver_names_hash_bucket_size 64;/' /etc/nginx/nginx.conf
grep -q '^[[:space:]]*server_names_hash_bucket_size' /etc/nginx/nginx.conf \
  || die "Failed to uncomment server_names_hash_bucket_size in nginx.conf"

step "Writing Nginx config..."
CONF=/etc/nginx/sites-available/sodiq-school.conf
cat > "$CONF" <<NGINX
# Client site (sodiqschool.uz + www)
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN_ROOT} ${DOMAIN_WWW};

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Admin (admin.sodiqschool.uz)
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN_ADMIN};

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Backend API (api.sodiqschool.uz)
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN_API};

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

ln -sf "$CONF" /etc/nginx/sites-enabled/sodiq-school.conf
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx
ok "Nginx HTTP config live."

# ---------- 3. Obtain Let's Encrypt certs ----------
step "Requesting SSL certificates via certbot --nginx..."
certbot --nginx \
  -n --agree-tos -m "${CERTBOT_EMAIL}" \
  --redirect \
  -d "${DOMAIN_ROOT}" \
  -d "${DOMAIN_WWW}" \
  -d "${DOMAIN_ADMIN}" \
  -d "${DOMAIN_API}"

systemctl reload nginx
ok "SSL active. Auto-renewal handled by systemd timer certbot.timer."

# ---------- 4. Update backend .env (origins + public URL) ----------
step "Updating backend/.env with HTTPS origins..."
BACKEND_ENV="${APP_ROOT}/backend/.env"
sed -i -E \
  -e "s|^CLIENT_ORIGIN=.*|CLIENT_ORIGIN=${PUBLIC_CLIENT}|" \
  -e "s|^ADMIN_ORIGIN=.*|ADMIN_ORIGIN=${PUBLIC_ADMIN}|" \
  -e "s|^PUBLIC_BASE_URL=.*|PUBLIC_BASE_URL=${PUBLIC_API}|" \
  "${BACKEND_ENV}"

# ---------- 5. Update front-end .env.production ----------
step "Updating front-end .env.production with HTTPS API URL..."
for d in client-site admin-site; do
  cat > "${APP_ROOT}/${d}/.env.production" <<EOF
NEXT_PUBLIC_API_BASE_URL=${PUBLIC_API}
INTERNAL_API_BASE_URL=${INTERNAL_API}
EOF
done

# ---------- 6. Restart backend (picks up new origins) ----------
step "Restarting backend..."
pm2 restart sodiq-backend --update-env
sleep 2

# Wait for backend reachability before rebuilding (it's a prerender dep)
for i in $(seq 1 30); do
  curl -fsS -o /dev/null --max-time 2 "${INTERNAL_API}/" && break
  sleep 1
done

# ---------- 7. Rebuild client + admin (bakes new public API URL into JS bundles) ----------
step "Rebuilding client-site..."
( cd "${APP_ROOT}/client-site" && npm run build )

step "Rebuilding admin-site..."
( cd "${APP_ROOT}/admin-site" && npm run build )

step "Restarting front-ends..."
pm2 restart sodiq-client --update-env
pm2 restart sodiq-admin --update-env
pm2 save

# ---------- 8. Tighten UFW — close direct 3000/3001/4000 from the internet ----------
step "Tightening UFW (closing 3000/3001/4000)..."
ufw delete allow 3000/tcp >/dev/null 2>&1 || true
ufw delete allow 3001/tcp >/dev/null 2>&1 || true
ufw delete allow 4000/tcp >/dev/null 2>&1 || true
ufw status verbose || true

# ---------- 9. Update credentials file ----------
CRED_FILE=/root/sodiq-credentials.txt
if [[ -f "$CRED_FILE" ]]; then
  step "Updating ${CRED_FILE} with public URLs..."
  {
    echo ""
    echo "--- Domain wiring ($(date -Iseconds)) ---"
    echo "Client     : ${PUBLIC_CLIENT}"
    echo "Admin      : ${PUBLIC_ADMIN}/login"
    echo "API        : ${PUBLIC_API}"
    echo "www->root  : ${PUBLIC_CLIENT} (certbot --redirect handles 80->443)"
  } >> "$CRED_FILE"
fi

# ---------- 10. Done ----------
echo ""
echo -e "${c_green}============================================================${c_off}"
echo -e "${c_green} DOMAIN WIRED${c_off}"
echo -e "${c_green}============================================================${c_off}"
echo ""
echo "  Client    : ${PUBLIC_CLIENT}"
echo "  Admin     : ${PUBLIC_ADMIN}/login"
echo "  API       : ${PUBLIC_API}"
echo ""
echo "  SSL auto-renews via certbot.timer (every 12h check)"
echo "  Test:   systemctl status certbot.timer"
echo "  Renew:  certbot renew --dry-run"
echo ""
echo -e "${c_green}============================================================${c_off}"
