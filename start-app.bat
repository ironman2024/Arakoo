@echo off
echo Starting Cheating Daddy Application...
echo.

REM Set NODE_ENV to development
set NODE_ENV=development

REM Start Vite dev server in background
echo Starting Vite dev server...
start /B npm run dev:vite

REM Wait for Vite to start
echo Waiting for Vite server to start...
timeout /t 5 /nobreak > nul

REM Start Electron
echo Starting Electron...
npm run dev:electron