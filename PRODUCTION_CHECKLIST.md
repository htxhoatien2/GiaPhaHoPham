# Checklist Vận Hành Thực Tế & Triển Khai Thương Mại (Production Operations Checklist)

Tài liệu này cung cấp danh mục kiểm tra an toàn vận hành bắt buộc trước khi bàn giao hệ thống **Gia Phả Số (GiaPhaHoPham)** hoặc triển khai gói dịch vụ đám mây cho Hội đồng Gia tộc / Khách hàng.

---

## 1. Kiểm Toán An Ninh & Tài Khoản Quản Trị (Security & Admin Bootstrap)

- [ ] **Cách ly Dữ liệu Thử nghiệm (Zero Demo Data in Production)**:
  - Tuyệt đối không nạp dữ liệu hạt giống thử nghiệm (`seed.sql` với mật khẩu demo `admin123`) vào cơ sở dữ liệu Production.
  - Cơ sở dữ liệu của khách hàng mới phải khởi tạo từ các tệp migration trắng (`supabase/migrations/`).
- [ ] **Khởi Tạo Tài Khoản Quản Trị Cấp Cao (SuperAdmin)**:
  - Tạo tài khoản Admin chính thức trực tiếp trong giao diện Authentication của Supabase Cloud.
  - Mật khẩu quản trị phải có độ dài tối thiểu 12 ký tự ngẫu nhiên (chữ hoa, thường, số và ký tự đặc biệt).
  - Cập nhật vai trò `role = 'admin'` trong bảng `profiles`.
- [ ] **Kích Hoạt Bảo Mật 2 Lớp (MFA / TOTP)**:
  - Bắt buộc Admin và các Editor quản lý chi họ bật Google Authenticator (TOTP) tại `/settings/security`.
- [ ] **Kiểm Tra Quyền Riêng Tư Mặc Định (Privacy Defaults)**:
  - Xác nhận chính sách RLS đang hoạt động: Thành viên chưa đăng nhập (Guest/Viewer) không thể đọc số điện thoại, email, địa chỉ của các thành viên còn sống.

---

## 2. Hạ Tầng & Kết Nối Đám Mây (Dedicated Infrastructure)

- [ ] **Thiết Lập Cơ Sở Dữ Liệu Riêng Biệt (Dedicated Database Instance)**:
  - Khởi tạo 1 Supabase Project độc lập hoặc cụm PostgreSQL riêng cho từng dòng họ khách hàng.
  - Không gộp chung database của nhiều dòng họ khác nhau.
- [ ] **Tên Miền Riêng & Chứng Chỉ Bảo Mật (Custom Domain & SSL)**:
  - Cấu hình tên miền đại diện dòng tộc (ví dụ: `giaphahopham.vn`, `giaphahonguyen.com`).
  - Kích hoạt chứng chỉ SSL/TLS tự động (HTTPS bắt buộc).
- [ ] **Cấu Hình Máy Chủ Gửi Email (Custom SMTP / Transactional Email)**:
  - Cấu hình SMTP (Resend, Brevo, Gmail App Password) trong Supabase Auth -> SMTP Settings để gửi email xác thực tài khoản và thông báo sự kiện giỗ chạp từ chính email của dòng họ.

---

## 3. Cấu Hình Thông Tin Dòng Tộc (White-Labeling & Branding)

- [ ] **Biến Môi Trường Dòng Họ (`.env`)**:
  - `NEXT_PUBLIC_CLAN_NAME`: Tên ngắn của dòng họ (e.g. `Họ Phạm Văn`).
  - `NEXT_PUBLIC_CLAN_FULL_NAME`: Tên trang trọng (e.g. `Gia Phả Dòng Họ Phạm Văn - An Trạch, Hòa Tiến, Đà Nẵng`).
  - `NEXT_PUBLIC_CLAN_FOUNDING_YEAR`: Năm khởi lập dòng họ.
- [ ] **Hình Ảnh Đại Diện & Biểu Tượng**:
  - Cập nhật Logo dòng họ tại `public/clan-logo.png` và Banner nhà thờ tộc tại `public/clan-banner.jpg`.
- [ ] **Cổng Đóng Góp Quỹ Khuyến Học VietQR**:
  - Kiểm tra thông tin số tài khoản, mã ngân hàng (BIN) và tên chủ tài khoản đại diện Hội đồng Gia tộc trong `/admin/settings` hoặc module VietQR.

---

## 4. Sao Lưu & Bảo Toàn Dữ Liệu (Backup & Disaster Recovery)

- [ ] **Tự Động Hóa Sao Lưu (Automated Snapshots)**:
  - Bật tính năng sao lưu hàng ngày trên Supabase Cloud (Daily Point-in-time Recovery).
- [ ] **Kiểm Tra Xuất/Nhập Dữ Liệu 1-Click**:
  - Thử nghiệm chức năng xuất toàn bộ 13 bảng ra tệp `.ZIP` tại `/admin/backup`.
  - Thử nghiệm xuất định dạng chuẩn quốc tế GEDCOM 7.0 (`.ged`) và Sách Gia Phả Word (`.docx`).
- [ ] **Bàn Giao & Hợp Đồng Dịch Vụ**:
  - Ký kết thỏa thuận điều khoản dịch vụ [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md).
  - Cung cấp chính sách bảo vệ dữ liệu cá nhân [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) cho Hội đồng Gia tộc.
