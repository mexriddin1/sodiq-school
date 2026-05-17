#requires -RunAsAdministrator
<#
    Sodiq School — yangilash skripti (kodda o'zgarish bo'lgandan keyin)
    Serverda ishlatish: C:\sodiq-school\deploy\update.ps1
#>

$ErrorActionPreference = "Stop"
$AppRoot = "C:\sodiq-school"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

Write-Step "GitHub'dan eng yangi kodni olish..."
Set-Location $AppRoot
git pull

Write-Step "Backend dependencies (agar package.json o'zgargan bo'lsa)..."
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

Write-Step "PM2 servislarni qayta ishga tushirish..."
pm2 restart all
pm2 save

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " YANGILANDI — pm2 status orqali tekshiring" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
pm2 status
