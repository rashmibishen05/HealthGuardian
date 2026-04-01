@echo off
echo.
echo ========================================
echo   Offline Health Guardian - Starting
echo ========================================
echo.
echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting development server...
echo.
echo The app will open at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

call npm run dev
