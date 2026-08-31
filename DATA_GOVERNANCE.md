# Quy Chế Quản Trị Dữ Liệu Phả Hệ & Tài Sản Tư Liệu Dòng Tộc (Data Governance Policy)

Tài liệu này xác định rõ quyền sở hữu, phân loại tài sản kỹ thuật số (Mã nguồn vs Dữ liệu vs Media Assets), quy trình sao lưu và lưu trữ vĩnh viễn cho hệ thống **Gia Phả Số (GiaPhaHoPham)**.

---

## 1. Phân Tách Quyền Sở Hữu: Mã Nguồn vs Tài Sản Tư Liệu vs Dữ Liệu Phả Hệ

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CƠ CẤU QUYỀN SỞ HỮU TÀI SẢN                          │
├──────────────────────┬──────────────────────────────────────────────────┤
│ 1. Mã Nguồn Cốt Lõi  │ Thuộc giấy phép phần mềm mã nguồn mở (MIT        │
│    (Core Codebase)   │ License / Gia Phả Số Contributors & Upstream)    │
├──────────────────────┼──────────────────────────────────────────────────┤
│ 2. Dữ Liệu Phả Hệ    │ Thuộc SỞ HỮU ĐỘC QUYỀN 100% CỦA DÒNG HỌ KHÁCH    │
│    (Genealogy Data)  │ HÀNG. Nhà cung cấp phần mềm không có quyền sở hữu│
├──────────────────────┼──────────────────────────────────────────────────┤
│ 3. Tài Sản Tư Liệu   │ Ảnh chụp sắc phong, văn tự cổ, ảnh nhà thờ,     │
│    (Digital Assets)  │ chân dung cụ tổ: Thuộc bản quyền và di sản của   │
│                      │ dòng họ.                                         │
└──────────────────────┴──────────────────────────────────────────────────┘
```

---

## 2. Quy Trình Sao Lưu & Bảo Toàn Dữ Liệu (Backup & Retention)

1. **Sao Lưu Tự Động (Automated Cloud Backups)**:
   - Hệ thống tự động tạo bản sao lưu dữ liệu toàn phần (Database Snapshot) định kỳ hàng tuần.
   - Bản sao lưu được lưu trữ trên hạ tầng lưu trữ độc lập (Secondary Storage Zone).

2. **Sao Lưu Thủ Công 1-Click Của Dòng Họ**:
   - Quản trị viên (Admin) dòng họ có thể tự xuất bản sao lưu bất kỳ lúc nào tại giao diện `/admin/backup`:
     - Xuất toàn bộ cơ sở dữ liệu và media thành 1 tệp nén **`.ZIP`**.
     - Xuất phả hệ theo định dạng chuẩn quốc tế **GEDCOM 7.0 (`.ged`)**.
     - Xuất Sách Gia Phả định dạng **Microsoft Word (`.docx`)**.

3. **Khả Năng Phục Hồi Thảm Họa (Disaster Recovery)**:
   - Thời gian phục hồi mục tiêu (RTO - Recovery Time Objective): Dưới 2 giờ làm việc.
   - Điểm khôi phục mục tiêu (RPO - Recovery Point Objective): Tối đa 24 giờ.

---

## 3. Quy Trình Xử Lý Khi Có Tranh Chấp Thông Tin Phả Ký

Trong trường hợp có sự không thống nhất giữa các chi phái về ngày tháng, thứ bậc hoặc hành trạng của tiền nhân:
1. Quyền quyết định cuối cùng thuộc về **Hội đồng Gia tộc / Trưởng Tộc**.
2. Hệ thống hỗ trợ ghi nhận nhiều dị bản (Other Names / Historical Notes / Biographies) để tôn trọng các nguồn tư liệu truyền khẩu khác nhau của từng chi nhánh mà không làm xáo trộn cây phả hệ chính thống.
