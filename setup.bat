@echo off
REM Birinchi marta to'liq setup: barcha 3 papkaga npm install + database reset.
REM Ishlatish: setup.bat (faqat 1 marta)

cd /d "%~dp0"

echo.
echo ============================================================
echo  Sodiq School - boshlang'ich setup
echo ============================================================
echo.
echo  Bu skript:
echo   1. Root va 3 papka uchun `npm install` qiladi
echo   2. MySQL'da database yaratadi va seed kontent solib qo'yadi
echo.
echo  MySQL serverni oldindan ishga tushgan bo'lishi kerak.
echo  Sozlamalarni `backend\.env` da tekshiring (DB_HOST, DB_USER va h.k.)
echo.
pause

call npm install
if errorlevel 1 goto :error

call npm run setup
if errorlevel 1 goto :error

echo.
echo ============================================================
echo  Setup tugadi!
echo ============================================================
echo.
echo  Endi `start.bat` ni ishga tushiring (yoki: npm run dev)
echo.
pause
goto :eof

:error
echo.
echo [xato] Setup bajarilmadi. Xatolikni o'qing va qayta urinib ko'ring.
pause
exit /b 1
