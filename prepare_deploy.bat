@echo off
setlocal EnableDelayedExpansion

echo ==========================================
echo      Savme.io Deployment Packager (Static)
echo ==========================================
echo.
echo 1. Finding build output...

if not exist "out" (
    echo [ERROR] 'out' folder not found!
    echo Please run 'build_project_v2.bat' first.
    pause
    exit /b
)

echo.
echo 2. Creating clean 'savme-deploy' folder...
if exist "savme-deploy" rd /s /q "savme-deploy"
mkdir "savme-deploy"

echo.
echo 3. Copying static files...
xcopy "out\*" "savme-deploy\" /E /H /C /Q /Y >nul

echo.
echo 4. Copying PHP Proxy...
if exist "public\gemini-proxy.php" (
    copy "public\gemini-proxy.php" "savme-deploy\" >nul
    echo [OK] gemini-proxy.php copied.
) else (
    echo [WARNING] gemini-proxy.php not found in public folder!
)

echo.
echo ==========================================
echo [SUCCESS] Package Ready!
echo.
echo You can now verify the "savme-deploy" folder.
echo UPLOAD everything inside "savme-deploy" to your server's public_html.
echo ==========================================
echo.
pause
