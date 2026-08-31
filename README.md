# Gia Phả Số (GiaPhaHoPham)

> **Hệ Thống Quản Lý Gia Phả Điện Tử Việt Nam — Dòng họ Phạm Văn (An Trạch, Hòa Tiến, Đà Nẵng)**

Phần mềm quản lý gia phả điện tử độc lập, chuẩn Clean Architecture, giúp gìn giữ và truyền thừa thông tin dòng họ qua các thế hệ.

*"Gìn giữ tinh hoa - Tiếp bước cha ông"*

## Tính năng

### Core (v1.0)
- **Cây gia phả trực quan** - Sơ đồ phả hệ tương tác, zoom, pan, collapse/expand, 10+ đời
- **Quản lý thành viên** - Hồ sơ cá nhân chi tiết (30+ trường thông tin)
- **Phân quyền 4 cấp** - Admin, Editor, Viewer, Guest (Supabase RLS)
- **Tìm kiếm** - Tra cứu nhanh theo tên, đời, chi nhánh
- **Admin Panel** - Quản lý người dùng, dữ liệu
- **Responsive** - Tương thích mobile/tablet/desktop

### Vietnamese Cultural (v1.1–v1.3)
- **Lịch âm dương** - Chuyển đổi chính xác, hiển thị ngày giỗ
- **Chi/nhánh** - Quản lý theo cấu trúc dòng họ Việt Nam
- **Đời (Generation)** - Tính tự động theo phả hệ
- **Can chi** - Giáp Tý, Ất Sửu, ...
- **Vinh danh thành tích** - Bảng vinh danh thành viên xuất sắc (học tập, sự nghiệp, cống hiến)
- **Quỹ khuyến học** - Quản lý quỹ, học bổng, khen thưởng, theo dõi thu chi
- **Hương ước gia tộc** - Gia huấn, quy ước, lời dặn con cháu
- **Thư mục thành viên** - Danh bạ liên lạc với quyền riêng tư
- **Lịch sự kiện** - Theo dõi ngày giỗ, lễ, tết

### Ceremony & Relations (v1.4–v1.5)
- **Cầu đương** - Phân công trách nhiệm cầu đương theo lịch âm (thuật toán DFS)
- **Quan hệ gia đình** - Hiển thị bố/mẹ/anh-chị-em/vợ-chồng/con theo giao diện trực quan
- **Thêm thành viên có quan hệ** - Chọn bố/mẹ khi tạo mới, thêm con vào gia đình
- **Cây lọc theo gốc** - Hiển thị cây gia phả bắt đầu từ bất kỳ thành viên nào

### Local Development (v1.6)
- **Chạy offline** - Supabase CLI + Docker, không cần tài khoản cloud
- **Dữ liệu demo** - 18 thành viên 5 đời sẵn sàng sau `pnpm local:setup`
- **Zero code change** - Cùng code base, chỉ khác env vars
- **Supabase CLI v2.76+** - Tương thích cả format mới (box-drawing table) và cũ (plain text)

### Security (v1.7)
- **Middleware bảo vệ toàn bộ** - Tất cả trang `(main)` yêu cầu đăng nhập, không chỉ `/admin`
- **RLS cật nhật** - Số điện thoại, email, Zalo, địa chỉ chỉ hiển thị với thành viên đăng nhập
- **Privacy mặc định an toàn** - Thành viên mới tạo mặc định chế độ `members only`
- **profiles bảo vệ** - Danh sách tài khoản không có thể bị thu thập nếu chưa đăng nhập

### Desktop App (v1.8)

- **Cài và chạy** - Tải installer, click cài, dùng ngay — không cần Node.js, Docker, hay tài khoản cloud
- **Hoạt động offline** - Dữ liệu lưu trên máy (SQLite), không cần internet
- **Đầy đủ chức năng** - 100% tính năng giống bản web
- **Cross-platform** - Hỗ trợ macOS và Windows
- **Dữ liệu demo** - 18 thành viên 5 đời sẵn sàng khi cài đặt
- **Tự động cập nhật** - Thông báo khi có phiên bản mới

### Landing Page (v2.1)

- **Trang giới thiệu** - Hero, tính năng, screenshots, download, cộng đồng
- **SEO** - Canonical URL, robots.txt, Open Graph
- **Download links** - Liên kết tải desktop app cho macOS/Windows

### Kho tài liệu & Hướng dẫn (v2.2)

- **Kho tài liệu** - Upload/lưu trữ ảnh lịch sử, gia phả giấy (PDF), bản đồ, video, bài viết
- **Phân loại** - 6 danh mục: Ảnh lịch sử, Giấy tờ, Bản đồ, Video, Bài viết, Khác
- **Tìm kiếm & lọc** - Gallery view với filter theo danh mục, tìm theo tiêu đề
- **Gắn thẻ thành viên** - Liên kết tài liệu với thành viên trong gia phả
- **Admin quản lý** - CRUD tài liệu, upload file, xác nhận xóa
- **Hướng dẫn sử dụng** - Trang `/help` trong app: 5 phần (điều hướng, workflow, phân quyền, mẹo, FAQ)
- **Desktop conditional** - Bản Desktop hiển thị thêm hướng dẫn sao lưu + bảng so sánh Desktop vs Web

### Security & Settings (v2.2.1)

- **Security hardening** - File size limit, MIME type validation, column whitelisting trên import ([@h4niz](https://github.com/H4niz))
- **Tùy chỉnh tên dòng họ** - Cấu hình qua env vars `NEXT_PUBLIC_CLAN_NAME` / `NEXT_PUBLIC_CLAN_FULL_NAME`
- **Trang Cài đặt** - `/admin/settings` hiển thị thông tin dòng họ, hệ thống, hướng dẫn thay đổi
- **API docs** - Tài liệu API endpoints đầy đủ cho 14 bảng + Auth + Storage
- **Secure coding review** - OWASP Top 10 + ASVS Level 1 audit

### Privacy & Verification (v2.3)

- **Xác nhận thành viên** - Admin duyệt tài khoản mới trước khi cho truy cập
- **Sub-admin** - Editor được cấp quyền xác nhận thành viên trong nhánh phụ trách
- **Hạn chế Viewer** - Viewer không thấy thông tin liên lạc, chỉ xem tên và cây gia phả
- **Quyền riêng tư tài liệu** - 3 cấp: Công khai / Thành viên / Nội bộ (admin+editor)
- **Email xác nhận** - Đăng ký cần verify email trước khi đăng nhập
- **Trang chờ xác nhận** - `/pending-verification` cho tài khoản chưa được duyệt
- **Middleware fail-closed** - Lỗi/timeout → chặn truy cập (không fail-open)
- **Client-side guard** - VerificationGuard trong layout bảo vệ client-side navigation

### Hồ sơ, MFA & Sao lưu (v2.4.1)

- **Hồ sơ tài khoản** - `/settings/profile`: xem & sửa tên hiển thị, đổi mật khẩu, avatar
- **Bảo mật MFA (TOTP)** - `/settings/security`: bật/tắt Google Authenticator, quét QR, nhập OTP 6 số
- **Sao lưu & Phục hồi** - `/admin/backup`: xuất 13 bảng ra ZIP, nhập lại 1-click, tự động lịch sao lưu
- **Quản lý tài khoản nâng cao** - Admin khoá/mở khoá, xoá tài khoản vĩnh viễn, duyệt xác nhận
- **Bulk Admin Actions** - Checkbox chọn nhiều, xác nhận/khoá/xoá hàng loạt với Promise.allSettled
- **Cài đặt dòng họ (động)** - Sửa tên, năm thành lập, nguồn gốc trực tiếp trong admin (không cần env vars)
- **Rate limiting** - Giới hạn đăng nhập/đăng ký (20/phút login, 10/phút register, 6/5 phút forgot-password)
- **Docker** - Dockerfile + docker-compose.yml, 1 lệnh `docker compose up` là chạy

### Cộng đồng & Nâng cao (v2.5)

- **Góc giao lưu** - Feed bài viết, bình luận, thả tim, upload ảnh (tối đa 5/bài), lọc theo loại, moderation
- **Tìm quan hệ** - BFS pathfinding giữa 2 thành viên + Vietnamese relationship labels
- **Thống kê nâng cao** - Dashboard biểu đồ (phân bố đời, giới tính, còn sống/mất) với Recharts
- **Xuất PDF** - Export tree viewport ra PDF (html2canvas + jsPDF, beta)
- **GEDCOM 7.0 Export** - Nâng cấp từ 5.5.1, hỗ trợ Vietnamese extensions (Quá Kế)
- **GEDCOM Import** - Parse .ged 5.5.1/7.0 → tạo people + families tự động
- **CSV Export** - Xuất danh sách thành viên ra Excel/CSV
- **Phát hiện trùng lặp** - Thuật toán Levenshtein + Vietnamese NFD normalization
- **Chế độ người cao tuổi** - Font size toggle + simplified list view
- **Thông báo** - Bell icon + 6 loại thông báo + DB triggers (không insert trực tiếp)
- **Trang Hội đồng** - `/council`: thông tin ban quản trị, lịch sử, sứ mệnh dòng họ (public)
- **Trang Nhà thờ họ** - `/ancestral-hall`: gallery ảnh, lịch tế lễ, bản đồ OpenStreetMap (public)
- **Đăng ký thành viên** - `/register-member`: form 12 trường + honeypot anti-spam + rate limit
- **Admin duyệt đơn** - `/admin/registrations`: duyệt/từ chối/xoá đơn ghi danh
- **Tìm kiếm thông minh** - Fuzzy search (Fuse.js) hỗ trợ dấu tiếng Việt
- **SEO hoàn chỉnh** - Sitemap động, robots.txt, Open Graph cho 4 trang public

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Database | Supabase (PostgreSQL, Auth, Storage, RLS) |
| State | React Query (TanStack Query) |
| Desktop | Electron 34, sql.js (WASM SQLite) |
| Deployment | Vercel + Supabase Cloud / Self-hosted Docker |
| Kiến Trúc | Dedicated Clan Instance (Cơ sở dữ liệu độc lập cho từng dòng họ) |

## Quick Start

### One-line Install (khuyên dùng)

> Cần: Docker Desktop đang chạy + Node.js 18+. Script tự cài pnpm & Supabase CLI nếu thiếu.

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/htxhoatien2/GiaPhaHoPham/main/install.sh | sh
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/htxhoatien2/GiaPhaHoPham/main/install.ps1 | iex
```

Xong → `cd GiaPhaHoPham/frontend && pnpm dev` → mở [http://localhost:4000](http://localhost:4000)

> [!CAUTION]
> **Cảnh báo bảo mật quan trọng**:
> - Tài khoản `admin@giapha.local` / `admin123` là **tài khoản hạt giống (Seed Data)** CHỈ DÙNG CHO MÔI TRƯỜNG THỬ NGHIỆM CỤC BỘ (Local Sandbox).
> - Khi triển khai môi trường **Production**, bạn bắt buộc phải tạo tài khoản Quản trị viên mới với mật khẩu mạnh qua Supabase Auth Dashboard. Tuyệt đối không dùng mật khẩu mặc định `admin123` trên internet.

### Option A: Desktop App (Offline SQLite)

> **Trạng thái**: Developer Preview / Self-compiled Edition.
> Phiên bản cài đặt thương mại 1-click sẽ được phát hành chính thức sau khi hoàn tất đăng ký chứng chỉ số EV/OV Code Signing cho Windows SmartScreen và Apple Developer ID cho macOS.
> Hướng dẫn tự biên dịch từ mã nguồn: Xem [docs/04-build/INSTALLATION-GUIDE.md](./docs/04-build/INSTALLATION-GUIDE.md).

### Option B: Local Development Sandbox (Chạy thử nghiệm)

> Yêu cầu Docker Desktop + Node.js 18+ + pnpm + Supabase CLI

```bash
git clone https://github.com/htxhoatien2/GiaPhaHoPham.git
cd GiaPhaHoPham/frontend
pnpm install
pnpm local:setup   # Khởi động Docker, chạy migration và tạo dữ liệu hạt giống
pnpm dev
```

Mở [http://localhost:4000](http://localhost:4000)  
*Tài khoản Sandbox Demo: `admin@giapha.local` / `admin123` (Chỉ dùng cho Local Test).*

### Option C: Docker (Triển khai Dedicated Instance)

```bash
git clone https://github.com/htxhoatien2/GiaPhaHoPham.git
cd GiaPhaHoPham
cp frontend/.env.local.example frontend/.env.local
# Cấu hình biến môi trường và Supabase URL/Keys của dòng họ
docker compose up -d
```

Mở [http://localhost:4000](http://localhost:4000)

### Option D: Supabase Cloud (Triển khai Production Dedicated Instance)

```bash
git clone https://github.com/htxhoatien2/GiaPhaHoPham.git
cd GiaPhaHoPham/frontend
pnpm install
cp .env.local.example .env.local
# Điền thông tin Supabase Project Production của dòng họ
pnpm build
pnpm start
```
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# Then run migrations in Supabase SQL Editor (supabase/migrations/ in order)
pnpm dev
```

Open [http://localhost:4000](http://localhost:4000)

## Project Structure

```
GiaPhaHoPham/
├── docs/                           # SDLC Documentation (LITE tier)
│   ├── 00-foundation/              # Vision, requirements, community
│   │   └── 06-Community/           # Community launch posts
│   ├── 01-planning/                # BRD, roadmap
│   ├── 02-design/                  # Architecture, UI/UX
│   ├── 04-build/                   # Sprint plans
│   └── 05-test/                    # Test plans
├── frontend/                       # Next.js application
│   ├── src/
│   │   ├── app/                    # App router (route groups)
│   │   │   ├── (auth)/             # Login, register
│   │   │   └── (main)/             # Main app with sidebar
│   │   │       ├── achievements/   # Vinh danh thành tích
│   │   │       ├── charter/        # Hương ước
│   │   │       ├── contributions/  # Đóng góp
│   │   │       ├── directory/      # Thư mục thành viên
│   │   │       ├── events/         # Lịch sự kiện
│   │   │       ├── fund/           # Quỹ khuyến học
│   │   │       ├── documents/       # Kho tài liệu (v2.2)
│   │   │       ├── feed/           # Góc giao lưu (v2.5)
│   │   │       ├── help/           # Hướng dẫn sử dụng (v2.2)
│   │   │       ├── notifications/ # Thông báo (v2.5)
│   │   │       ├── people/         # Quản lý thành viên
│   │   │       ├── relationship/  # Tìm quan hệ (v2.5)
│   │   │       ├── settings/       # Hồ sơ + Bảo mật MFA (v2.4.1)
│   │   │       ├── stats/         # Thống kê (v2.5)
│   │   │       ├── tree/           # Cây gia phả
│   │   │       └── admin/          # Admin panel
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # shadcn/ui
│   │   │   └── layout/            # Layout (sidebar, header)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Supabase client, data layer
│   │   └── types/                  # TypeScript types
│   └── supabase/                   # Supabase CLI
│       ├── config.toml             # Cấu hình local (ports, auth, storage)
│       ├── seed.sql                # Dữ liệu demo (18 thành viên)
│       └── migrations/             # Migration files (theo thứ tự timestamp)
│           ├── 20260224000000_database_setup.sql
│           ├── 20260224000001_sprint6_migration.sql
│           ├── 20260224000002_cau_duong_migration.sql
│           ├── 20260224000003_sprint75_migration.sql
│           ├── 20260224000004_storage_setup.sql
│           ├── 20260226000005_security_hardening.sql
│           ├── 20260227000006_sprint11_kho_tai_lieu.sql
│           ├── 20260227000007_storage_update_mime_types.sql
│           ├── 20260228000008_sprint12_privacy_verification.sql
│           ├── 20260228000009_user_management.sql
│           ├── 20260301000010_clan_settings.sql
│           ├── 20260310000011_sprint13_search_stats.sql
│           ├── 20260310000012_sprint14_gedcom_duplicate_elderly.sql
│           ├── 20260312000013_sprint15_feed.sql
│           ├── 20260315000016_sprint16_notifications.sql
│           ├── 20260317000017_sprint17_export_import.sql
│           └── 20260320000018_sprint18_registrations.sql
├── desktop/                        # Electron desktop app (Sprint 9)
│   ├── electron/                   # Main process (main.ts, server.ts, preload.ts)
│   ├── build/                      # App icons (icns, ico, png)
│   ├── migrations/                 # SQLite versioned migrations + seed data
│   ├── electron-builder.yml        # Cross-platform build config
│   └── package.json                # Electron + sql.js deps
├── docker-compose.yml              # Docker deployment (v2.5)
├── .sdlc-config.json               # SDLC configuration
├── CLAUDE.md                       # AI assistant guidelines
└── README.md
```

## Database

22 tables across 9 layers:

| Layer | Tables | Description |
|-------|--------|-------------|
| Core Genealogy | `people`, `families`, `children` | Phả hệ, quan hệ gia đình |
| Platform | `profiles`, `contributions`, `media`, `events` | Tài khoản, đóng góp, sự kiện |
| Culture (v1.3) | `achievements`, `fund_transactions`, `scholarships`, `clan_articles` | Vinh danh, quỹ, hương ước |
| Ceremony (v1.4) | `cau_duong_pools`, `cau_duong_assignments` | Phân công cầu đương lễ, tết |
| Documents (v2.2) | `clan_documents` | Kho tài liệu dòng họ |
| Settings (v2.3) | `clan_settings` | Cấu hình dòng họ + council + ceremonies |
| Feed (v2.5) | `posts`, `post_likes`, `post_comments` | Góc giao lưu dòng họ |
| Notifications (v2.5) | `notifications` | Thông báo realtime (trigger-only insert) |
| Registration (v2.5) | `member_registrations` | Đơn ghi danh thành viên |

All tables have Row Level Security (RLS) policies with 4 roles.

## Documentation

Full SDLC documentation (9 docs, 141KB):

| Stage | Documents |
|-------|-----------|
| 00-Foundation | Vision, Problem Statement, Market Research, Business Case |
| 01-Planning | BRD (77 FRs + 17 NFRs), Roadmap |
| 02-Design | Technical Design (14 tables), UI/UX Design |
| 04-Build | Sprint Plan, Installation Guide, User Guide |

See [docs/README.md](./docs/README.md) for full documentation index.

## Roadmap

```
v0.1.0 Alpha    [##########] Done - Infrastructure + Auth
v1.0.0 MVP      [##########] Done - Tree + CRUD + Admin + Deploy
v1.1.0 Enhanced [##########] Done - Directory + Calendar + Contributions
v1.2.0 Release  [##########] Done - GEDCOM + Book Generator + Photos
v1.3.0 Culture  [##########] Done - Vinh danh + Quỹ khuyến học + Hương ước
v1.4.0 Ceremony [##########] Done - Cầu đương rotation + DFS algorithm
v1.5.0 Relations[##########] Done - Family relations UX + tree filter by root
v1.6.0 LocalDev  [##########] Done - Supabase CLI + Docker local mode
v1.7.0 Security  [##########] Done - RLS hardening + middleware fix + privacy defaults
v1.8.0 Desktop   [##########] Done - Electron + sql.js standalone desktop app
v2.1.0 Landing   [##########] Done - Landing page + community docs + SEO
v2.2.0 Documents [##########] Done - Kho tài liệu + In-App Help guide
v2.2.1 Security  [##########] Done - Security patch + Clan name config + Settings page
v2.3.0 Privacy   [##########] Done - Xác nhận thành viên + Sub-admin + Privacy controls
v2.4.0 Profile   [##########] Done - Hồ sơ + MFA + Sao lưu + Docker + Rate limiting
v2.4.1 BulkAdmin [##########] Done - Bulk actions + Supabase CLI v2.76+ fix
v2.5.0 Community [##########] Done - Góc giao lưu + Thống kê + GEDCOM 7.0 + Thông báo + Nhà thờ họ + SEO
```

## 🌐 Triển Khai Cho Dòng Họ Của Bạn (Dedicated Clan Instance)

Hệ thống được thiết kế linh hoạt cho **mọi dòng họ Việt Nam** theo mô hình Dedicated Instance (mỗi dòng họ 1 database độc lập, bảo mật tối đa):

### Triển khai Nhanh Bản Web (Production Cloud)

1. Tạo một dự án Supabase mới cho dòng họ của bạn tại [supabase.com](https://supabase.com).
2. Chạy kịch bản khởi tạo database trong SQL Editor (`supabase/migrations/`).
3. Tạo tài khoản Quản trị viên (Admin) đầu tiên với mật khẩu mạnh trong phần Authentication.
4. Deploy frontend lên Vercel hoặc Cloud Server với biến môi trường của dòng họ (`NEXT_PUBLIC_CLAN_NAME`, `NEXT_PUBLIC_CLAN_FULL_NAME`).
5. Bắt đầu nhập liệu phả hệ và kết nối con cháu trên toàn cầu.

## 🏛️ Kiến Trúc Cốt Lõi (Clean Architecture)

Hệ thống được thiết kế theo mô hình Clean Architecture độc lập:
- **Core Domain (`frontend/src/core/`)**: 100% logic thuật toán thuần túy (Âm Dương Lịch thiên văn UTC+7, Xưng hô 3 miền, Lập lịch Cầu Đương DFS, Parser GEDCOM 7.0/5.5.1, Phát sinh VietQR Napas247, Xuất sách phả Word/PDF) không phụ thuộc framework UI hay cơ sở dữ liệu.
- **Tài liệu Xuất xứ & Kiểm toán Bản quyền**: Xem [PROVENANCE.md](./PROVENANCE.md)
- **Hướng dẫn Triển khai Thương mại hóa**: Xem [COMMERCIAL_GUIDE.md](./COMMERCIAL_GUIDE.md)
- **Checklist Sẵn Sàng Vận Hành & Triển Khai**: Xem [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
- **Chính Sách Bảo Vệ Dữ Liệu Cá Nhân (NĐ 13/2023/NĐ-CP)**: Xem [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)
- **Điều Khoản Dịch Vụ Gia Tộc**: Xem [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)
- **Quy Chế Quản Trị Dữ Liệu & Bản Quyền Tư Liệu**: Xem [DATA_GOVERNANCE.md](./DATA_GOVERNANCE.md)
- **Thông cáo Bản quyền Phân lớp**: Xem [NOTICE](./NOTICE)
- **Danh mục Giấy phép Phụ thuộc (SBOM)**: Xem [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md)

## Built With

This project was built using [TinySDLC](https://github.com/Minh-Tam-Solution/tinysdlc) agent orchestrator following [MTS-SDLC-Lite](https://github.com/Minh-Tam-Solution/MTS-SDLC-Lite) methodology.

## Contributors

- [@h4niz](https://github.com/H4niz) — Security review & hardening (OWASP Top 10, API docs, secure coding standards)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — Xem [LICENSE](./LICENSE) và [NOTICE](./NOTICE) để biết chi tiết bản quyền phân lớp và upstream attribution.
