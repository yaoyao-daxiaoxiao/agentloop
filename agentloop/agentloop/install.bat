@echo off
echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo npm install failed!
    exit /b 1
)
echo.
echo Dependencies installed successfully!
echo.
echo Testing CLI...
node bin/cli.js --help
