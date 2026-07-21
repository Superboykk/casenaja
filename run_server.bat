@echo off
title Krasue Case Archive Web Server
cd /d "%~dp0"
echo ===================================================
echo   KRASUE CASE ARCHIVE SYSTEM // LOCAL WEB SERVER
echo ===================================================
echo.
echo Starting local web server at http://localhost:8080 ...
echo Press Ctrl+C in this command window to stop the server.
echo.
timeout /t 2 /nobreak >nul
start http://localhost:8080
python -m http.server 8080
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Python not found, trying npx serve...
    npx -y serve -l 8080
)
pause
