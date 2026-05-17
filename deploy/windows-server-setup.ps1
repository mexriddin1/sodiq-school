#requires -RunAsAdministrator
<#
    Sodiq School — Windows Server deployment script
    --------------------------------------------------
    BIR MARTA serverda ishga tushiriladi:
      1) RDP orqali serverga ulaning
      2) PowerShell'ni Administrator sifatida oching
      3) Quyidagini bajaring:

         iwr -useb https://raw.githubusercontent.com/mexriddin1/sodiq-school/main/deploy/windows-server-setup.ps1 -OutFile C:\setup.ps1
         Set-ExecutionPolicy -Scope Process Bypass -Force
         C:\setup.ps1

    Skript quyidagilarni qiladi:
      - Chocolatey, Node.js 20 LTS, Git, MySQL 8, PM2 o'rnatadi
      - Repo'ni klonlaydi (C:\sodiq-school)
      - Parollarni interaktiv so'raydi (yoki .env.deploy faylidan oladi)
      - .env fayllarni production sozlamalari bilan yaratadi
      - npm install + build + database seed
      - PM2 bilan startupga qo'shadi, firewall'da portlarni ochadi

    XAVFSIZLIK: Hech qanday parol skriptning o'zida saqlanmaydi.
#>

$ErrorActionPreference = "Stop"

# ================================================================
# 1. KONFIGURATSIYA
# ================================================================
$RepoUrl   = "https://github.com/mexriddin1/sodiq-school.git"
$AppRoot   = "C:\sodiq-school"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

function Read-SecretLine($prompt, $default = $null) {
    if ($default) {
        $input = Read-Host "$prompt [default: $default]"
        if ([string]::IsNullOrWhiteSpace($input)) { return $default }
        return $input
    }
    return Read-Host $prompt
}

# Server IP avtomatik aniqlash
try {
    $ServerPublicIp = (Invoke-RestMethod -Uri "https://api.ipify.org" -TimeoutSec 5)
} catch {
    $ServerPublicIp = Read-SecretLine "Server'ning public IP manzilini kiriting"
}
Write-Host "Aniqlangan server IP: $ServerPublicIp" -ForegroundColor Yellow

# Parollarni interaktiv so'rash
Write-Host ""
Write-Host "----- PAROLLAR SO'ROVI -----" -ForegroundColor Yellow
$MysqlRootPass = Read-SecretLine "Yangi MySQL root paroli (kamida 12 belgi)"
if ($MysqlRootPass.Length -lt 8) {
    throw "Parol juda qisqa. Kamida 8 belgi kerak."
}

$AdminEmail    = Read-SecretLine "Admin email"             "developer@gmail.com"
$AdminPassword = Read-SecretLine "Admin paroli (saytga kirish uchun)"
$AdminName     = Read-SecretLine "Admin ismi"              "Developer"

# JWT secret avtomatik generatsiya
$JwtSecret = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

# Domain (agar hali yo'q bo'lsa, IP ishlatamiz)
$ClientOrigin = "http://${ServerPublicIp}:3000"
$AdminOrigin  = "http://${ServerPublicIp}:3001"
$PublicApiUrl = "http://${ServerPublicIp}:4000"

# ================================================================
# 2. CHOCOLATEY
# ================================================================
Write-Step "Chocolatey..."
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# ================================================================
# 3. NODE.JS, GIT, MYSQL
# ================================================================
Write-Step "Node.js 20 LTS, Git, MySQL 8 o'rnatish..."
choco install -y nodejs-lts git
choco install -y mysql --params "/Port:3306"

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Step "PM2 o'rnatish..."
npm install -g pm2 pm2-windows-startup
pm2-startup install

# ================================================================
# 4. MYSQL PAROL O'RNATISH
# ================================================================
Write-Step "MySQL root parolini o'rnatish..."
$mysqlBin = (Get-Command mysql.exe -ErrorAction SilentlyContinue).Source
if (-not $mysqlBin) {
    $mysqlBin = "C:\tools\mysql\current\bin\mysql.exe"
}
if (Test-Path $mysqlBin) {
    # Avval parolsiz urinish (toza o'rnatishda)
    try {
        & $mysqlBin -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$MysqlRootPass'; FLUSH PRIVILEGES;"
    } catch {
        Write-Host "MySQL'ga parolsiz kirish mumkin emas — parol allaqachon o'rnatilgan deb hisoblaymiz." -ForegroundColor Yellow
    }
}

# ================================================================
# 5. REPO
# ================================================================
Write-Step "Repo klonlash..."
if (Test-Path $AppRoot) {
    Write-Host "Repo allaqachon mavjud — git pull..."
    Set-Location $AppRoot
    git pull
} else {
    git clone $RepoUrl $AppRoot
    Set-Location $AppRoot
}

# ================================================================
# 6. .ENV FAYLLAR
# ================================================================
Write-Step ".env fayllarni yaratish..."

$backendEnv = @"
PORT=4000
NODE_ENV=production
CLIENT_ORIGIN=$ClientOrigin
ADMIN_ORIGIN=$AdminOrigin

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=$MysqlRootPass
DB_NAME=sodiq_school

JWT_SECRET=$JwtSecret
JWT_EXPIRES_IN=7d

SEED_ADMIN_EMAIL=$AdminEmail
SEED_ADMIN_PASSWORD=$AdminPassword
SEED_ADMIN_NAME=$AdminName

UPLOAD_DIR=uploads
PUBLIC_BASE_URL=$PublicApiUrl
"@
Set-Content -Path "$AppRoot\backend\.env" -Value $backendEnv -Encoding utf8

$frontEnv = "NEXT_PUBLIC_API_BASE_URL=$PublicApiUrl`n"
Set-Content -Path "$AppRoot\client-site\.env.production" -Value $frontEnv -Encoding utf8
Set-Content -Path "$AppRoot\admin-site\.env.production"  -Value $frontEnv -Encoding utf8

# ================================================================
# 7. DEPENDENCIES + BUILD
# ================================================================
Write-Step "Backend dependencies..."
Set-Location "$AppRoot\backend"
npm ci --omit=dev

Write-Step "Client-site dependencies + build..."
Set-Location "$AppRoot\client-site"
npm ci
npm run build

Write-Step "Admin-site dependencies + build..."
Set-Location "$AppRoot\admin-site"
npm ci
npm run build

# ================================================================
# 8. DATABASE
# ================================================================
Write-Step "Database yaratish + seed..."
Set-Location "$AppRoot\backend"
npm run db:reset

# ================================================================
# 9. PM2
# ================================================================
Write-Step "PM2 servislarni ishga tushirish..."
Set-Location $AppRoot

pm2 delete all 2>$null

pm2 start "npm" --name sodiq-backend --cwd "$AppRoot\backend"     -- start
pm2 start "npm" --name sodiq-client  --cwd "$AppRoot\client-site" -- start
pm2 start "npm" --name sodiq-admin   --cwd "$AppRoot\admin-site"  -- start

pm2 save

# ================================================================
# 10. FIREWALL
# ================================================================
Write-Step "Firewall portlarini ochish..."
New-NetFirewallRule -DisplayName "Sodiq Client (3000)"  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 -ErrorAction SilentlyContinue | Out-Null
New-NetFirewallRule -DisplayName "Sodiq Admin (3001)"   -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3001 -ErrorAction SilentlyContinue | Out-Null
New-NetFirewallRule -DisplayName "Sodiq Backend (4000)" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000 -ErrorAction SilentlyContinue | Out-Null

# ================================================================
# 11. NATIJA
# ================================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " DEPLOY YAKUNLANDI" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host " Client sayt :  http://${ServerPublicIp}:3000"
Write-Host " Admin panel :  http://${ServerPublicIp}:3001/login"
Write-Host " Backend API :  http://${ServerPublicIp}:4000"
Write-Host ""
Write-Host " Admin login :  $AdminEmail"
Write-Host ""
Write-Host " PM2 status:  pm2 status"
Write-Host " Loglar    :  pm2 logs"
Write-Host " Restart   :  pm2 restart all"
Write-Host ""
Write-Host " Production .env: $AppRoot\backend\.env (parol va JWT secret saqlanadi)"
Write-Host "============================================================" -ForegroundColor Green
