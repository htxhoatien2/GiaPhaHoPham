# Hướng dẫn Triển khai Web App (Phương án 1) — Gia Phả Họ Phạm Văn

Tài liệu này hướng dẫn chi tiết từng bước để đưa hệ thống Gia phả điện tử của **Họ Phạm Văn làng An Trạch** lên môi trường chạy thực tế trên Internet thông qua các dịch vụ đám mây miễn phí chất lượng cao (**Supabase Cloud** và **Vercel**).

---

## Tổng quan kiến trúc thực tế
* **Frontend & Backend API:** Next.js chạy trên nền tảng **Vercel** (Miễn phí hoàn toàn, tự động cấp SSL bảo mật, tải trang cực nhanh).
* **Cơ sở dữ liệu & Xác thực & Lưu trữ:** **Supabase Cloud** (Cung cấp PostgreSQL, Supabase Auth để đăng nhập, và Supabase Storage để lưu trữ hình ảnh gia phả, tư liệu dòng họ - Miễn phí gói Free Tier).

---

## BƯỚC 1: Xuất mã nguồn từ AI Studio
Để có mã nguồn triển khai, bạn thực hiện xuất toàn bộ mã nguồn ra máy tính:
1. Tại giao diện **Google AI Studio Build**, bấm vào biểu tượng **Settings** (bánh răng) ở góc trái hoặc thanh menu.
2. Chọn **Export as ZIP** để tải toàn bộ mã nguồn về máy tính, hoặc chọn **Export to GitHub** để đẩy thẳng dự án lên tài khoản GitHub cá nhân của bạn (khuyên dùng để kết nối với Vercel dễ nhất).
3. Nếu tải ZIP, bạn giải nén thư mục trên máy tính của mình.

---

## BƯỚC 2: Khởi tạo Cơ sở dữ liệu Supabase Cloud
1. Truy cập [https://supabase.com](https://supabase.com) và đăng ký tài khoản miễn phí.
2. Nhấp vào **New Project** (Dự án mới) và điền các thông tin:
   * **Name:** `Gia Pha Ho Pham Van`
   * **Database Password:** Nhập mật khẩu bảo mật (hãy lưu lại mật khẩu này).
   * **Region:** Chọn khu vực gần Việt Nam nhất (ví dụ: `Singapore` hoặc `Southeast Asia`).
   * **Pricing Plan:** Chọn gói **Free** ($0/tháng).
3. Chờ khoảng 1-2 phút để Supabase khởi tạo cơ sở dữ liệu cho dòng họ.

---

## BƯỚC 3: Thiết lập Cấu trúc Cơ sở dữ liệu (Database Migrations)
Vì dự án có sẵn 17 tệp SQL di trú (migrations) cấu trúc dữ liệu trong thư mục `frontend/supabase/migrations/`, bạn có hai cách để chạy các tệp này trên dự án Supabase Cloud mới:

### Cách A: Sử dụng Supabase CLI (Chuyên nghiệp & Nhanh nhất)
Nếu bạn có một chút kiến thức về dòng lệnh, đây là cách sạch sẽ nhất:
1. Mở terminal trên máy tính tại thư mục dự án vừa tải về.
2. Cài đặt và đăng nhập Supabase CLI:
   ```bash
   npx supabase login
   ```
3. Liên kết dự án local của bạn với dự án Supabase Cloud vừa tạo:
   ```bash
   npx supabase link --project-ref <Mã-dự-án-của-bạn>
   ```
   *(Lưu ý: `<Mã-dự-án-của-bạn>` có thể tìm thấy trong URL của trang quản trị Supabase, ví dụ: `https://supabase.com/dashboard/project/abcxyz...` thì mã là `abcxyz`)*.
4. Đẩy toàn bộ cấu trúc bảng và chính sách bảo mật RLS lên mây:
   ```bash
   npx supabase db push
   ```
5. *(Tùy chọn)* Nếu bạn muốn nhập 18 thành viên demo ban đầu để kiểm tra trước khi nhập liệu thật, chạy lệnh sau:
   ```bash
   npx supabase db reset
   ```

### Cách B: Sao chép thủ công qua SQL Editor (Đơn giản nhất)
Nếu bạn không muốn sử dụng dòng lệnh:
1. Tại trang quản trị Supabase Cloud của bạn, vào mục **SQL Editor** ở thanh menu bên trái.
2. Nhấp vào **New Query** (Truy vấn mới).
3. Lần lượt mở các tệp SQL trong thư mục `frontend/supabase/migrations/` theo thứ tự từ trên xuống dưới (được đánh số thứ tự từ `20260224000000_...` đến `20260320000018_...`).
4. Copy toàn bộ nội dung của từng tệp, dán vào SQL Editor trên Supabase và nhấn nút **Run** để thực thi.
5. Tạo hai Storage Buckets công khai để chứa tài liệu và ảnh:
   * Vào mục **Storage** -> **New Bucket**.
   * Tạo bucket tên là `media` và tích chọn **Public** (Công khai).
   * Tạo bucket tên là `documents` và tích chọn **Public** (Công khai).

---

## BƯỚC 4: Triển khai ứng dụng Next.js lên Vercel
1. Truy cập [https://vercel.com](https://vercel.com) và đăng ký tài khoản bằng tài khoản GitHub của bạn.
2. Nhấn vào **Add New...** -> **Project**.
3. Chọn kho lưu trữ GitHub chứa mã nguồn dự án của bạn (hoặc tải thư mục `frontend` của dự án lên nếu sử dụng công cụ CLI).
4. Tại phần **Project Settings**:
   * **Framework Preset:** Chọn **Next.js**.
   * **Root Directory:** Hãy chỉnh sửa và chọn thư mục `frontend` (vì mã nguồn trang web nằm trong thư mục con này).
5. Mở rộng phần **Environment Variables** (Biến môi trường) và thêm các khóa sau lấy từ dự án Supabase của bạn (Vào Supabase -> **Project Settings** -> **API**):

| Tên biến (Key) | Giá trị (Value) | Mô tả |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | *Dán Project URL từ Supabase* | Đường dẫn kết nối API cơ sở dữ liệu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Dán anon/public key từ Supabase* | Khóa công khai bảo mật cho trình duyệt |
| `SUPABASE_SERVICE_ROLE_KEY` | *Dán service_role key từ Supabase* | Khóa quản trị tối cao (chỉ chạy ở server, bảo mật tuyệt đối) |
| `NEXT_PUBLIC_CLAN_NAME` | `Họ Phạm Văn` | Tên viết tắt hiển thị trên hệ thống |
| `NEXT_PUBLIC_CLAN_FULL_NAME` | `Họ Phạm Văn làng An Trạch` | Tên đầy đủ hiển thị trên trang chủ |
| `NEXT_PUBLIC_LOCAL_DEV` | `false` | Đặt là false để hệ thống chuyển sang chế độ Cloud hoạt động thực tế |
| `CRON_SECRET` | *Nhập một chuỗi ký tự ngẫu nhiên dài* | Khóa bảo mật để kích hoạt tự động hóa sự kiện |

6. Nhấn nút **Deploy**! Quá trình biên dịch sẽ diễn ra trong vòng 2-3 phút. Khi hoàn tất, Vercel sẽ cung cấp cho bạn một đường liên kết truy cập công khai (dạng `https://ten-du-an.vercel.app`) để toàn bộ con cháu dòng họ có thể truy cập ngay lập tức.

---

## BƯỚC 5: Cấu hình gửi Email thông báo thực tế (Tùy chọn)
Mặc định khi đăng ký tài khoản mới, hệ thống sẽ yêu cầu xác thực email. Để gửi được email xác thực từ chính dòng họ của bạn, bạn cần cấu hình SMTP trong phần cài đặt của Supabase Cloud:
1. Vào Supabase -> **Project Settings** -> **Auth** -> **SMTP Settings**.
2. Bật **Enable Custom SMTP**.
3. Điền thông tin SMTP từ các nhà cung cấp miễn phí như Gmail (sử dụng App Password), Resend, Brevo, hoặc Mailgun:
   * **Sender email:** Email gửi tin (ví dụ: `bannhipsu@giaphaphamvan.com` hoặc gmail của bạn).
   * **Sender name:** Gia phả Họ Phạm Văn
   * **SMTP Host:** ví dụ `smtp.gmail.com`
   * **SMTP Port:** `587` hoặc `465`
   * **SMTP Username & Password** tương ứng.

---

## Thông tin đăng nhập quản trị ban đầu
Sau khi cơ sở dữ liệu đã khởi tạo thành công, tài khoản quản trị tối cao mặc định để bạn đăng nhập lần đầu tiên thiết lập là:
* **Tài khoản:** `admin@giapha.local`
* **Mật khẩu:** `admin123`

*Lưu ý bảo mật:* Ngay sau khi đăng nhập lần đầu thành công trên trang web thực tế, bạn hãy vào mục **Quản lý tài khoản (Admin Panel)** hoặc **Hồ sơ cá nhân** để tiến hành thay đổi email quản trị và mật khẩu của mình để tránh người lạ xâm nhập.

Chúc dòng họ **Họ Phạm Văn làng An Trạch** vận hành hệ thống Gia phả điện tử thành công tốt đẹp!
