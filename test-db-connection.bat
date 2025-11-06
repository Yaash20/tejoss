@echo off
echo ========================================
echo    TEJOSS - Test Database Connection
echo ========================================
echo.
echo This script will test your database connection.
echo Make sure .env file exists in /backend folder!
echo.
pause

cd backend

echo.
echo Running connection test...
echo.

node test-connection.js

echo.
echo ========================================
echo    Test Complete
echo ========================================
echo.
pause
