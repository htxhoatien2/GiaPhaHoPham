@echo off
echo ===================================
echo   Dang dong bo code len GitHub...
echo ===================================
echo.

if exist copy-assets.bat call copy-assets.bat

echo.
echo [1/3] Dang them file thay doi...
git add .

echo.
echo [2/3] Dang tao commit...
git commit -m "Update GiaPhaHoPham codebase and remove footer"

echo.
echo [3/3] Dang push len GitHub...
git push

echo.
echo ===================================
echo   Dong bo hoan tat!
echo ===================================
