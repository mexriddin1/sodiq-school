#requires -RunAsAdministrator
# Sodiq School - Windows Server deployment script
# Run on the server in PowerShell (Administrator):
#   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
#   iwr -useb https://raw.githubusercontent.com/mexriddin1/sodiq-school/main/deploy/windows-server-setup.ps1 -OutFile C:\setup.ps1
#   Set-ExecutionPolicy -Scope Process Bypass -Force
#   C:\setup.ps1

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# ----- Config -----
$RepoUrl = "https://github.com/mexriddin1/sodiq-school.git"
$AppRoot = "C:\sodiq-school"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

function Read-WithDefault($prompt, $default) {
    if ($default) {
        $val = Read-Host "$prompt [default: $default]"
        if ([string]::IsNullOrWhiteSpace($val)) { return $default }
        return $val
    }
    return Read-Host $prompt
}

# Detect public IP
try {
    $ServerPublicIp = (Invoke-RestMethod -Uri "https://api.ipify.org" -TimeoutSec 5)
} catch {
    $ServerPublicIp = Read-Host "Could not auto-detect public IP. Enter server IP"
}
Write-Host "Server public IP: $ServerPublicIp" -ForegroundColor Yellow

# Ask for passwords
Write-Host ""
Write-Host "----- PASSWORDS -----" -ForegroundColor Yellow
$MysqlRootPass = Read-Host "New MySQL root password (min 8 chars)"
if ($MysqlRootPass.Length -lt 8) {
    throw "Password too short (min 8 chars)."
}
$AdminEmail    = Read-WithDefault "Admin email"             "developer@gmail.com"
$AdminPassword = Read-Host        "Admin password (for site login)"
$AdminName     = Read-WithDefault "Admin display name"      "Developer"

# Auto-generate JWT secret
$JwtSecret = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

$ClientOrigin = "http://${ServerPublicIp}:3000"
$AdminOrigin  = "http://${ServerPublicIp}:3001"
$PublicApiUrl = "http://${ServerPublicIp}:4000"

# ----- 1. Chocolatey -----
Write-Step "Installing Chocolatey..."
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# ----- 2. Node.js, Git, MySQL -----
Write-Step "Installing Node.js 20 LTS, Git, MySQL 8..."
choco install -y nodejs-lts git
choco install -y mysql --params "/Port:3306"

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Step "Installing PM2..."
npm install -g pm2 pm2-windows-startup
pm2-startup install

# ----- 3. Set MySQL root password -----
Write-Step "Setting MySQL root password..."
$mysqlBin = (Get-Command mysql.exe -ErrorAction SilentlyContinue).Source
if (-not $mysqlBin) {
    $mysqlBin = "C:\tools\mysql\current\bin\mysql.exe"
}
if (Test-Path $mysqlBin) {
    try {
        & $mysqlBin -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$MysqlRootPass'; FLUSH PRIVILEGES;"
    } catch {
        Write-Host "Could not set MySQL password (it may already be set). Continuing." -ForegroundColor Yellow
    }
}

# ----- 4. Clone repo -----
Write-Step "Cloning repo..."
if (Test-Path $AppRoot) {
    Write-Host "Repo already exists, pulling latest..."
    Set-Location $AppRoot
    git pull
} else {
    git clone $RepoUrl $AppRoot
    Set-Location $AppRoot
}

# ----- 5. Write .env files -----
Write-Step "Writing .env files..."

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

# ----- 6. Dependencies + build -----
Write-Step "Backend npm ci..."
Set-Location "$AppRoot\backend"
npm ci --omit=dev

Write-Step "Client-site npm ci + build..."
Set-Location "$AppRoot\client-site"
npm ci
npm run build

Write-Step "Admin-site npm ci + build..."
Set-Location "$AppRoot\admin-site"
npm ci
npm run build

# ----- 7. DB seed -----
Write-Step "Creating DB + seeding..."
Set-Location "$AppRoot\backend"
npm run db:reset

# ----- 8. PM2 -----
Write-Step "Starting services with PM2..."
Set-Location $AppRoot

pm2 delete all 2>$null

pm2 start "npm" --name sodiq-backend --cwd "$AppRoot\backend"     -- start
pm2 start "npm" --name sodiq-client  --cwd "$AppRoot\client-site" -- start
pm2 start "npm" --name sodiq-admin   --cwd "$AppRoot\admin-site"  -- start

pm2 save

# ----- 9. Firewall -----
Write-Step "Opening firewall ports..."
New-NetFirewallRule -DisplayName "Sodiq Client 3000"  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 -ErrorAction SilentlyContinue | Out-Null
New-NetFirewallRule -DisplayName "Sodiq Admin 3001"   -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3001 -ErrorAction SilentlyContinue | Out-Null
New-NetFirewallRule -DisplayName "Sodiq Backend 4000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000 -ErrorAction SilentlyContinue | Out-Null

# ----- 10. Done -----
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " DEPLOY COMPLETE" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host " Client site :  http://${ServerPublicIp}:3000"
Write-Host " Admin panel :  http://${ServerPublicIp}:3001/login"
Write-Host " Backend API :  http://${ServerPublicIp}:4000"
Write-Host ""
Write-Host " Admin login :  $AdminEmail"
Write-Host ""
Write-Host " PM2 status :  pm2 status"
Write-Host " PM2 logs   :  pm2 logs"
Write-Host " Restart    :  pm2 restart all"
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
