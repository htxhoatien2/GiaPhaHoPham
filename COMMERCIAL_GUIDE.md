# Hướng Dẫn Thương Mại Hóa & Triển Khai Toàn Diện (Commercialization Guide)

Tài liệu này cung cấp hướng dẫn chi tiết dành cho cá nhân, doanh nghiệp, ban trị sự dòng tộc hoặc đơn vị phát triển khi thương mại hóa phần mềm **Gia Phả Số (AncestorTree)**.

---

## 1. Các Mô Hình Kinh Doanh Khả Thi (Business Models)

```
                       ┌──────────────────────────────────────────────┐
                       │           MÔ HÌNH THƯƠNG MẠI HÓA             │
                       └──────────────────────┬───────────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
         ▼                                    ▼                                    ▼
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│  B2C/B2B2C SAAS  │               │   ON-PREMISE     │               │ DỊCH VỤ GIA TĂNG │
│  (Cloud Tenant)  │               │  (Desktop/Hội đồng)               │ (Số hóa & In ấn) │
├──────────────────┤               ├──────────────────┤               ├──────────────────┤
│ Thu phí hàng năm │               │ Bán license trọn │               │ Nhận số hóa phả cũ│
│ theo số thành    │               │ đời, cài đặt cục │               │ Xuất sách mạ vàng│
│ viên & dung lượng│               │ bộ bảo mật cao   │               │ Dựng 3D lăng mộ  │
└──────────────────┘               └──────────────────┘               └──────────────────┘
```

### 1.1. Mô Hình 1: SaaS Cloud (Multi-Tenancy)
- **Đối tượng**: Các dòng họ vừa và nhỏ, gia đình hạt nhân muốn có website gia phả online kết nối con cháu trên toàn cầu.
- **Gói cước gợi ý**:
  - **Gói Cơ Bản (Miễn phí / Khởi đầu)**: Tối đa 50 thành viên, 3 đời, 100MB lưu trữ ảnh.
  - **Gói Gia Tộc (500.000 VNĐ - 1.200.000 VNĐ / năm)**: Không giới hạn thành viên, 10+ đời, lịch giỗ tự động gửi tin nhắn/Zalo, Quỹ khuyến học VietQR, 10GB lưu trữ tài liệu sắc phong.
  - **Gói Đại Tộc (2.500.000 VNĐ / năm)**: Đầy đủ tính năng, tên miền riêng (e.g. `giaphahopham.vn`), hỗ trợ sao lưu tự động hàng tuần.

### 1.2. Mô Hình 2: On-Premise / Bản Desktop Offline Vĩnh Viễn
- **Đối tượng**: Các đại tộc, dòng họ lớn yêu cầu tuyệt đối về bảo mật thông tin nội bộ, không muốn đưa dữ liệu gia đình lên đám mây công cộng.
- **Hình thức**: Bán key kích hoạt phần mềm Desktop (Electron/Tauri SQLite), dữ liệu mã hóa lưu trực tiếp trên ổ cứng máy tính nhà thờ tộc.

### 1.3. Mô Hình 3: Dịch Vụ Số Hóa & In Ấn Sách Phả Cao Cấp
- **Dịch vụ trọn gói**:
  1. Cử chuyên viên về tận từ đường dòng họ chụp ảnh tài liệu cổ, dịch chữ Hán Nôm sang Quốc ngữ.
  2. Nhập liệu và lập trình cây phả hệ chuẩn.
  3. Xuất file Word/PDF bìa cứng mạ vàng trao tặng tộc trưởng và các chi phái.

---

## 2. Các Tính Năng Đòn Bẩy Thương Mại (Revenue Enablers)

### 2.1. Cổng Đóng Góp Quỹ Khuyến Học & Công Đức VietQR
- Hệ thống tích hợp sẵn engine tạo mã VietQR theo chuẩn Napas247 / EMVCo.
- Con cháu chỉ cần mở ứng dụng ngân hàng quét mã QR, nội dung chuyển khoản tự động điền:
  `[TÊN DÒNG HỌ] [HỌ TÊN CON CHÁU] [MỤC ĐÍCH ĐÓNG GÓP]`
- Tiền chuyển trực tiếp 100% vào tài khoản của Ban Quản lý Tộc, không qua trung gian.

### 2.2. Trình Xuất Bản Sách Gia Phả Word (.docx) & Bản Đồ Phả Hệ Lớn
- 1-click xuất toàn bộ cây phả hệ ra tài liệu Microsoft Word chuẩn mực theo phong cách văn tế truyền thống Việt Nam.
- Sẵn sàng chuyển giao cho các nhà in chuyên nghiệp in sách lưu truyền hậu thế.

### 2.3. Chế Độ Bô Lão / Người Cao Tuổi (Elderly Accessibility)
- Giao diện thân thiện tối đa với người cao tuổi: Font chữ lớn, biểu tượng rõ ràng, loại bỏ menu phức tạp, hỗ trợ tra cứu ngày giỗ và phân công cúng tế Cầu Đương tức thì.

---

## 3. Quy Trình Đổi Thương Hiệu Nhanh (White-Labeling Checklist)

Để triển khai hệ thống cho một dòng họ mới:

1. **Bước 1: Cấu hình biến môi trường (`.env`)**:
   ```env
   NEXT_PUBLIC_CLAN_NAME="Họ Nguyễn Văn"
   NEXT_PUBLIC_CLAN_FULL_NAME="Gia Phả Dòng Họ Nguyễn Văn - Làng Cổ Am, Hải Phòng"
   NEXT_PUBLIC_CLAN_FOUNDING_YEAR="1428"
   NEXT_PUBLIC_CLAN_LOCATION="Hải Phòng, Việt Nam"
   NEXT_PUBLIC_BANK_BIN="970422" # Mã Ngân hàng Quân Đội MBBank
   NEXT_PUBLIC_BANK_ACCOUNT="0123456789"
   NEXT_PUBLIC_BANK_ACCOUNT_NAME="NGUYEN VAN A - TRUONG TOC"
   ```

2. **Bước 2: Thay đổi Logo & Ảnh bìa Nhà thờ**:
   - Đặt file logo vào `public/logo.png` và banner vào `public/banner.jpg`.

3. **Bước 3: Khởi tạo dữ liệu**:
   - Chọn **Khởi tạo dữ liệu mới** trong `/admin/settings` hoặc nhập tệp tin chuẩn **GEDCOM 7.0**.
