#requires -RunAsAdministrator
# Sodiq School - update script (run after code changes pushed to GitHub)
# Usage on server: C:\sodiq-school\deploy\update.ps1

$ErrorActionPreference = "Stop"
$AppRoot = "C:\sodiq-school"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

Write-Step "Pulling latest from GitHub..."
Set-Location $AppRoot
git pull

Write-Step "Backend deps..."
Set-Location "$AppRoot\backend"
npm ci --omit=dev

Write-Step "Client-site build..."
Set-Location "$AppRoot\client-site"
npm ci
npm run build

Write-Step "Admin-site build..."
Set-Location "$AppRoot\admin-site"
npm ci
npm run build

Write-Step "Restarting PM2..."
pm2 restart all
pm2 save

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " UPDATED" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
pm2 status
