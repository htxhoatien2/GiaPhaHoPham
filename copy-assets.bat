@echo off
chcp 65001 > nul
echo ===================================================
echo   Đang sao chép Logo & Banner vào frontend/public...
echo ===================================================
echo.

if exist "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" (
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" "frontend\public\clan-logo.png" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" "frontend\public\clan-logo.jpg" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784815468249.jpg" "frontend\public\logo.png" /Y > nul
)

if exist "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784816156457.jpg" (
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784816156457.jpg" "frontend\public\clan-banner.jpg" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784816156457.jpg" "frontend\public\clan-banner.png" /Y > nul
  copy "C:\Users\pctua\.gemini\antigravity-ide\brain\ab8529bd-557b-467b-b432-2f7f658c5d42\media__1784816156457.jpg" "frontend\public\banner.jpg" /Y > nul
)

echo Đã cập nhật Logo và Banner.
