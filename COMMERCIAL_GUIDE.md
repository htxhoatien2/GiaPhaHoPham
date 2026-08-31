# Hướng Dẫn Thương Mại Hóa & Triển Khai Thực Tế (Commercialization Guide)

Tài liệu này cung cấp hướng dẫn chiến lược và kỹ thuật dành cho cá nhân, doanh nghiệp, ban quản lý gia tộc khi triển khai thương mại hóa phần mềm **Gia Phả Số (GiaPhaHoPham)**.

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
│ DEDICATED CLOUD  │               │   ON-PREMISE     │               │ DỊCH VỤ GIA TĂNG │
│ (Managed Host)   │               │(Bản cài Từ đường)│               │ (Số hóa & In ấn) │
├──────────────────┤               ├──────────────────┤               ├──────────────────┤
│ Mỗi dòng họ 1 DB │               │ Cài đặt máy cục  │               │ Nhận số hóa phả cũ│
│ riêng biệt 100%  │               │ bộ offline, bảo  │               │ Xuất sách mạ vàng│
│ Thu phí vận hành │               │ mật tuyệt đối    │               │ Dịch Hán Nôm     │
└──────────────────┘               └──────────────────┘               └──────────────────┘
```

### 1.1. Mô Hình 1: Dedicated Managed Cloud (Khuyên Dùng Hiện Tại)
- **Kiến trúc**: Mỗi dòng họ được cấp một Dedicated Instance riêng biệt (1 database Supabase/PostgreSQL độc lập).
- **Lợi ích**:
  - Dữ liệu gia tộc được cô lập vật lý 100%, bảo mật tuyệt đối.
  - Không có rủi ro rò rỉ dữ liệu chéo giữa các dòng họ.
  - Dễ dàng tùy biến tên miền riêng (ví dụ: `giaphahopham.vn`, `giaphahonguyen.com`).
- **Gói cước gợi ý**:
  - **Gói Tiêu Chuẩn (1.200.000 VNĐ - 2.500.000 VNĐ / năm)**: Bao gồm phí hạ tầng Cloud, bảo trì hệ thống, tự động sao lưu dữ liệu hàng tuần, tích hợp Quỹ Khuyến học VietQR.

### 1.2. Mô Hình 2: On-Premise / Bản Cài Đặt Tại Nhà Thờ Tộc
- **Đối tượng**: Các đại tộc lớn yêu cầu bảo mật nội bộ cao nhất, không đưa dữ liệu lên đám mây công cộng.
- **Hình thức**: Chuyển giao gói cài đặt cục bộ (Docker / Standalone Desktop Engine với SQLite), dữ liệu mã hóa lưu tại máy chủ nhà thờ tộc.

### 1.3. Mô Hình 3: Dịch Vụ Số Hóa & In Ấn Sách Phả Cao Cấp (Doanh Thu Cao Nhất)
- **Quy trình dịch vụ trọn gói**:
  1. Cử chuyên viên về từ đường dòng họ chụp ảnh tài liệu, dịch thuật gia phả Hán Nôm sang Quốc ngữ.
  2. Số hóa toàn bộ phả hệ vào hệ thống Gia Phả Số.
  3. Xuất file Microsoft Word (.docx) chuẩn mực qua engine `BookExportEngine`, chuyển giao nhà in đóng sách da mạ vàng lưu truyền hậu thế.

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
- Giao diện thân thiện tối đa với người cao tuổi: Font chữ lớn, biểu tượng rõ ràng, hỗ trợ tra cứu ngày giỗ và phân công cúng tế Cầu Đương tức thì.

---

## 3. Trạng Thái Bản Desktop & Lộ Trình Code Signing

- **Trạng thái hiện tại**: Developer Preview / Self-compiled Edition.
- **Lộ trình thương mại**: Sẽ mở bán gói cài đặt 1-click cho người dùng phổ thông sau khi hoàn tất đăng ký chứng chỉ số EV/OV Code Signing cho Windows và Apple Developer ID cho macOS.
