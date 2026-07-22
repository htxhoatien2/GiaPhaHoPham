@echo off
chcp 65001 > nul
echo ===================================
echo   Đang đồng bộ code lên GitHub...
echo ===================================
echo.
echo [1/3] Đang thêm file thay đổi...
git add .
echo.
set /p commit_msg="Nhập nội dung commit (bấm Enter để dùng mặc định 'Update'): "
if "%commit_msg%"=="" set commit_msg=Update

echo.
echo [2/3] Đang tạo commit: "%commit_msg%"...
git commit -m "%commit_msg%"

echo.
echo [3/3] Đang push lên GitHub...
git push

echo.
echo ===================================
echo   Đồng bộ hoàn tất!
echo ===================================
pause
