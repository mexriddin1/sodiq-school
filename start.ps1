# Bitta klik bilan barcha 3 servisni ishga tushiradi (PowerShell variant).
# Ishlatish: .\start.ps1
# Birinchi marta avtomatik npm install + DB reset bajaradi.

Set-Location -Path $PSScriptRoot

if (-not (Test-Path "node_modules")) {
    Write-Host "[setup] Birinchi marta ishlatish - npm install + DB reset bajarilmoqda..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Host "npm install muvaffaqiyatsiz" -ForegroundColor Red; exit 1 }
    npm run setup
    if ($LASTEXITCODE -ne 0) { Write-Host "Setup muvaffaqiyatsiz" -ForegroundColor Red; exit 1 }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Sodiq School - barcha servislar ishga tushmoqda" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Backend  : http://localhost:4000" -ForegroundColor Yellow
Write-Host " Client   : http://localhost:3000" -ForegroundColor Cyan
Write-Host " Admin    : http://localhost:3001/login" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Default admin: developer@gmail.com / developer`$123" -ForegroundColor Green
Write-Host " To'xtatish uchun: Ctrl+C" -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
