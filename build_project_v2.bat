@echo off
setlocal
echo ==========================================
echo      Savme.io Deployment Builder V2
echo ==========================================
echo.
echo Current Directory: %CD%
echo Script Directory: %~dp0
echo.

cd /d "%~dp0"
echo Changed to: %CD%

if not exist package.json (
    echo [ERROR] package.json NOT FOUND in this folder!
    echo Please make sure this file is inside the 'savme.io' folder.
    pause
    exit /b
)

echo.
echo [1/2] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b
)

echo.
echo [2/2] Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm run build failed.
    pause
    exit /b
)

echo.
echo.
echo ==========================================
if exist "out" (
    echo [SUCCESS] Build completed successfully!
    echo Your deployment files are in: out
    start out
) else (
    echo [ERROR] Build finished but 'out' folder is missing.
)
echo ==========================================
echo.
pause
