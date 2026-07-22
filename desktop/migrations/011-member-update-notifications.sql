-- Sprint 21: Member Update Notifications (SQLite version for desktop app)

-- Triggers in SQLite for local offline notifications on people table

CREATE TRIGGER IF NOT EXISTS trg_notify_people_insert
AFTER INSERT ON people
BEGIN
    INSERT INTO notifications (id, user_id, type, title, body, link, reference_id, created_at)
    VALUES (
        lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
        'local_user',
        'new_member',
        'Thành viên mới',
        'Thành viên mới ' || NEW.display_name || ' đã được thêm vào gia phả.',
        '/people/' || NEW.id,
        NEW.id,
        datetime('now')
    );
END;

CREATE TRIGGER IF NOT EXISTS trg_notify_people_update
AFTER UPDATE ON people
BEGIN
    INSERT INTO notifications (id, user_id, type, title, body, link, reference_id, created_at)
    VALUES (
        lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
        'local_user',
        'member_updated',
        'Cập nhật thành viên',
        'Thông tin thành viên ' || NEW.display_name || ' đã được cập nhật.',
        '/people/' || NEW.id,
        NEW.id,
        datetime('now')
    );
END;

CREATE TRIGGER IF NOT EXISTS trg_notify_people_delete
AFTER DELETE ON people
BEGIN
    INSERT INTO notifications (id, user_id, type, title, body, link, reference_id, created_at)
    VALUES (
        lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
        'local_user',
        'member_deleted',
        'Xóa thành viên',
        'Thành viên ' || OLD.display_name || ' đã được xóa khỏi gia phả.',
        '/people',
        OLD.id,
        datetime('now')
    );
END;
