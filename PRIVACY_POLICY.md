# Chính Sách Bảo Vệ Dữ Liệu Cá Nhân & Quyền Riêng Tư Gia Tộc (Privacy Policy)

> **Căn cứ pháp lý**: Tuân thủ Nghị định số **13/2023/NĐ-CP** ngày 17/04/2023 của Chính phủ về Bảo vệ dữ liệu cá nhân tại Việt Nam.  
> **Áp dụng cho**: Hệ thống Gia Phả Số (GiaPhaHoPham) — Bản Web SaaS & Bản Dedicated Cloud / On-Premise.

---

## 1. Nguyên Tắc Thu Thập & Mục Đích Xử Lý Dữ Liệu

1. **Mục Đích Thu Thập Hợp Pháp**:
   - Dữ liệu phả hệ (Họ tên, ngày sinh, ngày mất, nơi an táng, quan hệ huyết thống, chi nhánh, tiểu sử, thành tích, thông tin liên lạc) được thu thập và lưu trữ thuần túy nhằm mục đích:
     - Gìn giữ, truyền thừa di sản văn hóa và cội nguồn gia tộc.
     - Lập lịch cúng tế, giỗ chạp, cầu đương và kết nối tình thân giữa các thành viên dòng họ.
     - Quản lý quỹ khuyến học, vinh danh học tập và công đức xây dựng nhà thờ tộc.
   - Tuyệt đối **không** bán, cho thuê, thương mại hóa hoặc chia sẻ dữ liệu nhân thân của thành viên dòng họ cho bất kỳ bên thứ ba nào vì mục đích quảng cáo hoặc tiếp thị.

2. **Sự Đồng Thuận Của Chủ Thể Dữ Liệu (Consent)**:
   - Việc ghi nhận thông tin thành viên còn sống phải có sự đồng ý của chính thành viên đó hoặc người giám hộ hợp pháp/đại diện gia đình (trưởng chi, trưởng nhánh, tộc trưởng).

---

## 2. Phân Loại Dữ Liệu & Cơ Chế Phân Quyền Bảo Vệ (4 Cấp Độ)

Hệ thống triển khai cơ chế **Row Level Security (RLS)** trên cơ sở dữ liệu để kiểm soát nghiêm ngặt quyền truy cập:

| Cấp Quyền (Role) | Phạm Vi Truy Cập Dữ Liệu | Quyền Hạn |
| :--- | :--- | :--- |
| **Admin (Tộc trưởng / Ban Quản trị)** | Toàn quyền xem, sửa, phân quyền, sao lưu và duyệt thành viên. | Duyệt tài khoản mới, phân vai trò, xuất file sao lưu. |
| **Editor (Ban Khánh tiết / Trưởng chi)** | Xem toàn bộ cây gia phả; thêm/sửa thành viên và sự kiện trong chi nhánh phụ trách. | Chỉnh sửa tiểu sử, thêm ảnh tư liệu, ghi nhận thu chi quỹ. |
| **Member (Con cháu đã xác thực)** | Xem đầy đủ cây phả hệ, thông tin liên lạc nội bộ của các thành viên khác. | Tham gia góc giao lưu, tra cứu xưng hô, đóng góp quỹ khuyến học. |
| **Guest / Viewer (Chưa xác thực)** | Chỉ xem được tên và sơ đồ cây phả hệ cơ bản. **Ẩn 100% số điện thoại, email, địa chỉ, ngày sinh chính xác** của thành viên còn sống. | Xem thông tin công khai dòng họ. |

---

## 3. Quyền Của Chủ Thể Dữ Liệu

Theo quy định của pháp luật Việt Nam, mỗi thành viên trong gia phả có đầy đủ các quyền:
1. **Quyền Được Biết & Xem Dữ Liệu**: Tra cứu hồ sơ cá nhân và vị trí của mình trên cây phả hệ.
2. **Quyền Yêu Cầu Chỉnh Sửa**: Đề nghị Ban Quản trị cập nhật thông tin sai lệch về bản thân hoặc thân nhân trực hệ.
3. **Quyền Yêu Cầu Giới Hạn / Ẩn Thông Tin (Privacy Level)**:
   - Mỗi hồ sơ cá nhân có 3 chế độ: `Public` (Công khai), `Members Only` (Chỉ thành viên nội bộ), `Private` (Chỉ bản thân và Admin thấy).
4. **Quyền Yêu Cầu Xóa / Hủy Bỏ Dữ Liệu**: Yêu cầu ẩn hoặc xóa thông tin nhạy cảm khỏi hệ thống khi có lý do chính đáng.

---

## 4. Bảo Mật Hệ Thống & Mã Hóa Dữ Liệu

1. **Mã Hóa Đường Truyền**: 100% kết nối qua giao thức HTTPS (TLS 1.3).
2. **Xác Thực Đa Yếu Tố (MFA / 2FA)**: Hỗ trợ mã OTP 6 số chuẩn Google Authenticator / TOTP cho các tài khoản quản trị để ngăn ngừa xâm nhập trái phép.
3. **Sao Lưu Độc Lập**: Dữ liệu sao lưu định kỳ được mã hóa và chỉ bàn giao cho Tộc trưởng hoặc đại diện được ủy quyền bằng văn bản của dòng họ.
