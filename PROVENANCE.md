# Tuyên Bố Xuất Xứ Mã Nguồn & Kiểm Toán Bản Quyền (Provenance & IP Statement)

> **Dự án**: Gia Phả Số (AncestorTree)  
> **Phiên bản**: v3.0  
> **Ngày phát hành**: 2026  
> **Trạng thái**: Sạch (Clean-room), Độc lập, Sẵn sàng Thương mại hóa & Mã nguồn mở  

---

## 1. Tuyên Bố Bản Quyền & Nguồn Gốc Sáng Lập (IP Declaration)

1. **Quyền Tác Giả Gốc (Original Authorship)**:
   - Toàn bộ kiến trúc phần mềm, cấu trúc cơ sở dữ liệu (PostgreSQL/SQLite), thuật toán nghiệp vụ (Âm Dương Lịch thiên văn UTC+7, Xưng hô 3 miền, Lập lịch Cầu Đương luân phiên, Trình tạo VietQR, Sách gia phả Word/PDF, GEDCOM 7.0 Parser) đều được tự phát triển độc lập theo nguyên tắc **Clean-Room Design**.
   - Không chứa mã nguồn độc quyền của bên thứ ba không có giấy phép, không vi phạm các thỏa thuận bảo mật (NDA) hoặc bản quyền của bất kỳ cá nhân hay tổ chức nào.

2. **Dữ Liệu Mẫu & Tôn Vinh Dòng Họ (Seed Data)**:
   - Dữ liệu phả hệ họ Phạm Văn (Làng An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng) được số hóa và đưa vào hệ thống với sự đồng thuận của Hội đồng Gia tộc nhằm mục đích phụng sự cộng đồng, gìn giữ di sản văn hóa dòng tộc và làm tập dữ liệu mẫu chuẩn (Gold Standard Demo Dataset).

---

## 2. Kiểm Toán Phần Mềm & Giấy Phép Phụ Thuộc (Software Bill of Materials - SBOM)

Toàn bộ các thư viện bên thứ ba (Dependencies) được sử dụng trong codebase đều tuân thủ các giấy phép nguồn mở tương thích thương mại (**Permissive Open Source Licenses**), tuyệt đối không sử dụng các thư viện có giấy phép Copyleft khắt khe (như GPL v3 hoặc AGPL) gây ảnh hưởng đến việc phân phối phần mềm thương mại độc lập:

| Tên Thư Viện | Phiên Bản | Giấy Phép (License) | Mục Đích Sử Dụng | Mức Độ An Toàn Thương Mại |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js** | 16.x | MIT License | Framework Fullstack React | ✅ An toàn tuyệt đối (Permissive) |
| **React / React DOM** | 19.x | MIT License | Core UI Component Library | ✅ An toàn tuyệt đối (Permissive) |
| **Tailwind CSS** | 4.x | MIT License | Styling & Design System | ✅ An toàn tuyệt đối (Permissive) |
| **Radix UI** | 1.x | MIT License | Headless UI Components | ✅ An toàn tuyệt đối (Permissive) |
| **Lucide Icons** | 0.x | ISC License | Iconography vector | ✅ An toàn tuyệt đối (Permissive) |
| **Supabase JS / SSR** | 2.x | MIT / Apache 2.0 | Auth & Realtime Database SDK | ✅ An toàn tuyệt đối (Permissive) |
| **docx** | 9.x | MIT License | Xuất bản sách gia phả MS Word | ✅ An toàn tuyệt đối (Permissive) |
| **Zod** | 3.x / 4.x | MIT License | Schema Validation | ✅ An toàn tuyệt đối (Permissive) |
| **Vitest** | 4.x | MIT License | Automated Unit Testing | ✅ An toàn tuyệt đối (Permissive) |
| **sql.js / SQLite** | 1.x | MIT / Public Domain | Offline Embedded Database Engine | ✅ An toàn tuyệt đối (Permissive) |
| **Framer Motion** | 12.x | MIT License | Micro-animations & Canvas Pan/Zoom | ✅ An toàn tuyệt đối (Permissive) |

---

## 3. Kiến Trúc Tách Biệt Độc Lập (Clean Architecture Isolation)

Codebase được thiết kế tách biệt theo mô hình **Hexagonal / Clean Architecture**:
- **Core Domain Engine (`src/core/`)**: Chứa 100% logic thuật toán thuần khiết (Vanilla TypeScript), không phụ thuộc vào React, Next.js, Node.js hay bất kỳ cơ sở dữ liệu nào. Module này có thể đóng gói thành thư viện NPM riêng hoặc biên dịch sang WebAssembly/Mobile/Desktop.
- **Application Layer (`src/lib/`, `src/hooks/`)**: Kết nối giữa Core Engine và giao diện người dùng.
- **Infrastructure Layer (`src/supabase/`, SQLite)**: Quản lý lưu trữ và phân quyền người dùng (Row Level Security).
- **Presentation Layer (`src/app/`, `src/components/`)**: Giao diện tương tác người dùng hiện đại, hỗ trợ Chế độ Người cao tuổi và đa thiết bị.

---

## 4. Cam Kết Pháp Lý & Bảo Đảm Thương Mại Hóa

1. **Khả Năng Đổi Thương Hiệu (White-Labeling Ready)**: Hệ thống cho phép thay đổi toàn bộ tên dòng họ, logo, cờ tộc, lời tựa gia phả mà không cần sửa đổi mã nguồn cốt lõi.
2. **Khả Năng Chuyển Đổi Mô Hình Kinh Doanh (Multi-Tenancy SaaS & On-Premise)**:
   - Bản **SaaS Cloud**: Đăng ký thuê bao cho hàng nghìn dòng họ cùng lúc.
   - Bản **Desktop / On-Premise**: Cài đặt offline vĩnh viễn trên máy tính gia tộc không cần internet.
3. **An Ninh & Quyền Riêng Tư (Privacy & GDPR/Nghị định 13/2023/NĐ-CP)**: Dữ liệu thân nhân, ngày sinh, mộ phần, số điện thoại được bảo vệ bởi cơ chế phân quyền 4 cấp độ nghiêm ngặt và mã hóa dữ liệu.
