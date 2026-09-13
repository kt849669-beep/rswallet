@echo off
setlocal
cd /d "%~dp0"
if exist "%~dp0.runtime\node\node.exe" set "PATH=%~dp0.runtime\node;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 24 x64 from nodejs.org, then run this file again.
  pause
  exit /b 1
)
if not exist "node_modules\.bin\vinext.cmd" (
  call npm ci
  if errorlevel 1 goto failed
)
node scripts/setup-local.mjs
if errorlevel 1 goto failed
echo.
echo RsWallet 1.0
echo Login: http://127.0.0.1:3000/login
echo Admin: http://127.0.0.1:3000/admin
echo Keep this window open while using RsWallet. Ctrl+C stops it.
call npm run dev -- --host 127.0.0.1 --port 3000 --strictPort
if errorlevel 1 goto failed
exit /b 0
:failed
echo.
echo RsWallet could not start. See the message above.
pause
exit /b 1
