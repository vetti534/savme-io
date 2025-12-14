@echo off
echo ==========================================
echo      Savme.io Deployment Bulder
echo ==========================================
echo.
echo Navigate to project directory...
cd /d "%~dp0"

echo.
echo Installing dependencies (if needed)...
call npm install

echo.
echo Building project...
call npm run build

echo.
echo ==========================================
if exist ".next\standalone" (
    echo [SUCCESS] Build completed!
    echo Your deployment files are in: .next\standalone
) else (
    echo [ERROR] Build failed. Please check the errors above.
)
echo ==========================================
echo.
pause
