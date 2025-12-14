@echo off
setlocal
echo ==========================================
echo      Savme.io Automation Setup
echo ==========================================

:: 1. Define Git Path explicitly since it's missing from PATH
set "GIT_PATH=C:\Program Files\Git\cmd\git.exe"

if not exist "%GIT_PATH%" (
    echo [ERROR] Git not found at expected location.
    echo Please restart your computer and try again.
    pause
    exit /b
)

echo [OK] Found Git at: %GIT_PATH%

:: 2. Configure Git User (Required)
echo.
echo Configuring Git...
"%GIT_PATH%" config --global user.name "Savme Admin"
"%GIT_PATH%" config --global user.email "admin@savme.io"

:: 3. Initialize Repository
echo.
echo Initializing Repository...
if not exist ".git" (
    "%GIT_PATH%" init
) else (
    echo [INFO] Repository already exists.
)

:: 4. Add Files
echo.
echo Adding files...
"%GIT_PATH%" add .
"%GIT_PATH%" commit -m "Initial automated setup"

echo.
echo ==========================================
echo [STEP 1 COMPLETE] Local Git is ready.
echo.
echo NOW: Go to GitHub.com -> New Repository
echo Name it: savme-io
echo.
echo After creating it, copy the URL (https://github.com/...)
echo and paste it below.
echo ==========================================
set /p REPO_URL="Paste GitHub URL here: "

if "%REPO_URL%"=="" goto End

echo.
echo Linking to GitHub...
"%GIT_PATH%" remote add origin %REPO_URL%
"%GIT_PATH%" branch -M main
"%GIT_PATH%" push -u origin main

echo.
echo [SUCCESS] Project is now on GitHub!
:End
pause
