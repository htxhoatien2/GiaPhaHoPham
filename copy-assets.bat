@echo off
echo ===================================================
echo   Sao chep Logo & Banner vao frontend/public...
echo ===================================================
echo.

if exist "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" (
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" "frontend\public\clan-logo.png" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" "frontend\public\clan-logo.jpg" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" "frontend\public\logo.png" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" "frontend\public\favicon.ico" /Y > nul
)

if exist "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784816156457.jpg" (
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784816156457.jpg" "frontend\public\clan-banner.jpg" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784816156457.jpg" "frontend\public\clan-banner.png" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784816156457.jpg" "frontend\public\banner.jpg" /Y > nul
)

if exist copy-logo.mjs node copy-logo.mjs > nul 2>&1
if exist update-banner.mjs node update-banner.mjs > nul 2>&1
if exist frontend\scripts\clean-conflicting-routes.mjs node frontend\scripts\clean-conflicting-routes.mjs > nul 2>&1

echo Da cap nhat Logo, Banner va don dẹp tuyen duong trung lap thanh cong.
