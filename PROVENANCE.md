# Tuyên Bố Xuất Xứ Mã Nguồn & Kiểm Toán Bản Quyền (Provenance & IP Statement)

> **Dự án**: Gia Phả Số (AncestorTree / GiaPhaHoPham)  
> **Phiên bản**: v3.0  
> **Ngày phát hành**: 2026  
> **Trạng thái**: Sạch (Clean Architecture), Minh bạch bản quyền phân lớp, Sẵn sàng Thương mại hóa  

---

## 1. Cấu Trúc Bản Quyền Phân Lớp (Layered Provenance Structure)

1. **Phần Kế Thừa Từ Upstream (Upstream Attribution)**:
   - Dự án kế thừa và phát triển từ nền tảng mã nguồn mở `AncestorTree` (tác giả: Minh-Tam-Solution) được phát hành theo giấy phép **MIT License**.
   - Thông tin ghi nhận bản quyền được lưu trữ tập trung tại [NOTICE](./NOTICE) và [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).

2. **Phần Nghiên Cứu & Phát Triển Mới (Original Works by GiaPhaHoPham)**:
   - Toàn bộ module Core Domain Engine độc lập ([frontend/src/core/](./frontend/src/core/)):
     - Thuật toán thiên văn Âm Dương Lịch Hồ Ngọc Đức UTC+7, Can Chi, tính ngày giỗ (`lunar-solar.engine.ts`).
     - Thuật toán xưng hô gia tộc 3 miền (Bắc/Trung/Nam) chuẩn "Cành Bác - Cành Chú" (`kinship.engine.ts`).
     - Thuật toán phân công Cầu Đương luân phiên (`cau-duong.engine.ts`).
     - Trình chuyển đổi GEDCOM 7.0 & 5.5.1 UTF-8 (`gedcom-v7.engine.ts`).
     - Cổng VietQR Napas247 động cho Quỹ Khuyến học & Công đức (`vietqr.engine.ts`).
     - Trình xuất bản Sách Gia Phả Microsoft Word (.docx) chuyên nghiệp (`book-export.engine.ts`).
   - Các cải tiến bảo mật, cấu trúc dữ liệu phả hệ họ Phạm Văn làng An Trạch (Hòa Tiến, Đà Nẵng) và hệ thống phân quyền 4 cấp độ.

3. **Kiểm Toán Phụ Thuộc Nguồn Mở (SBOM)**:
   - 100% các thư viện bên thứ ba (Dependencies) đều sử dụng giấy phép nguồn mở tương thích thương mại (**MIT, Apache 2.0, ISC, BSD**). Không có thành phần Copyleft (GPL v3, AGPL) gây ảnh hưởng đến việc phân phối phần mềm thương mại. Chi tiết xem tại [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).

---

## 2. Minh Bạch Hóa Kiến Trúc: "Dedicated Clan Instance" vs "Multi-Tenant SaaS"

Để đảm bảo tính trung thực và bảo mật cao nhất cho khách hàng:

- **Hiện tại (Giai đoạn V1 – V2.5)**: **Dedicated Clan Instance Architecture (Kiến Trúc Cơ Sở Dữ Liệu Riêng Biệt Cho Từng Dòng Họ)**:
  - Mỗi dòng họ sở hữu một cơ sở dữ liệu Supabase / PostgreSQL / SQLite hoàn toàn độc lập về mặt vật lý.
  - Ưu điểm: Đảm bảo cách ly dữ liệu 100% tuyệt đối, không có bất kỳ rủi ro rò rỉ dữ liệu chéo giữa các dòng tộc khác nhau.
  - Phù hợp cho mô hình: Dedicated Cloud Hosting hoặc On-Premise tại nhà thờ tộc.
- **Lộ trình Phát triển (V3+)**: **Shared Multi-Tenant SaaS Engine**:
  - Phát triển kiến trúc chia sẻ hạ tầng dùng chung với định danh `tenant_id` và Row Level Security (RLS) cưỡng chế trên 100% bảng, storage, API và cơ chế tìm kiếm.

---

## 3. Minh Bạch Trạng Thái Bản Desktop

- **Bản Web Application**: Hoàn thiện 100%, sẵn sàng triển khai trên môi trường Production & Thương mại hóa.
- **Bản Desktop App (Offline SQLite)**:
  - Hiện tại: **Developer Preview / Self-compiled Edition** (sẵn sàng biên dịch và chạy trên Electron/SQLite).
  - Kế hoạch thương mại hóa đại trà: Sẽ được phát hành chính thức sau khi hoàn tất quy trình ký số (EV/OV Code Signing Certificate) cho Windows SmartScreen và Apple Developer ID cho macOS.

---

## 4. Tách Biệt Tuyệt Đối Dữ Liệu Thử Nghiệm & Production

- **Tài khoản Sandbox Demo (`admin@giapha.local` / `admin123`)**: Chỉ tồn tại trong tập dữ liệu thử nghiệm cục bộ (`seed.sql` / local dev setup).
- **Môi trường Production**: Bắt buộc tạo tài khoản Admin chính thức với mật khẩu ngẫu nhiên an toàn thông qua Auth Dashboard hoặc kịch bản quản trị an toàn. Nghiêm cấm dùng tài khoản demo mặc định trên môi trường trực tuyến.
