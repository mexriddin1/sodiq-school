@echo off
REM Bitta klik bilan barcha 3 servisni ishga tushiradi.
REM Birinchi marta ishlatishdan oldin: setup.bat ni ishga tushiring (yoki: npm run setup)

cd /d "%~dp0"

if not exist "node_modules" (
  echo [setup] Birinchi marta ishlatishni aniqladim - npm install + DB reset bajarilmoqda...
  call npm install
  if errorlevel 1 goto :error
  call npm run setup
  if errorlevel 1 goto :error
)

echo.
echo ============================================================
echo  Sodiq School - barcha servislar ishga tushmoqda
echo ============================================================
echo  Backend  : http://localhost:4000
echo  Client   : http://localhost:3000
echo  Admin    : http://localhost:3001/login
echo ============================================================
echo  Default admin: developer@gmail.com / developer$123
echo  To'xtatish uchun: Ctrl+C
echo ============================================================
echo.

REM `npm run dev` predev hook avtomatik kill-ports ni chaqiradi
call npm run dev
goto :eof

:error
echo.
echo [xato] Setup yoki ishga tushirish bajarilmadi.
pause
exit /b 1
