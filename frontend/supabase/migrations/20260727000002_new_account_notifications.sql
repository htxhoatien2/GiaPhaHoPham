-- ============================================================================
-- Migration: Thông báo khi có Thành viên Ghi danh mới và Tài khoản Đăng ký mới
-- AncestorTree v3.1.0
-- ============================================================================

-- ─── 1. Trigger Function: Thông báo khi có Tài khoản Đăng ký mới ────────────

CREATE OR REPLACE FUNCTION notify_new_account_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Gửi thông báo đến tất cả Admin và Editor khi có tài khoản mới đăng ký
    INSERT INTO notifications (user_id, type, title, body, link, actor_id, reference_id)
    SELECT
        p.user_id,
        'account_verified',
        'Tài khoản đăng ký mới',
        COALESCE(NEW.full_name, NEW.email) || ' (' || NEW.email || ') vừa đăng ký tài khoản mới trên hệ thống.',
        '/admin/users',
        NEW.user_id,
        NEW.user_id::text
    FROM profiles p
    WHERE p.role IN ('admin', 'editor')
      AND p.user_id IS NOT NULL
      AND p.user_id != NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notify_new_account_signup ON profiles;

CREATE TRIGGER trg_notify_new_account_signup
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION notify_new_account_signup();

-- ─── 2. Cập nhật Trigger: Thông báo khi có Đơn Ghi danh mới ───────────────────

CREATE OR REPLACE FUNCTION notify_registration_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Gửi thông báo đến cả Admin và Editor khi có đơn ghi danh mới
        INSERT INTO notifications (user_id, type, title, body, link, actor_id, reference_id)
        SELECT
            p.user_id,
            'registration_submitted',
            'Đơn ghi danh mới',
            NEW.full_name || ' vừa gửi đơn ghi danh gia nhập dòng họ.',
            '/admin/registrations',
            NEW.user_id,
            NEW.id::text
        FROM profiles p
        WHERE p.role IN ('admin', 'editor')
          AND p.user_id IS NOT NULL;

        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
        -- Gửi thông báo tới người đăng ký khi đơn ghi danh chuyển trạng thái
        IF NEW.user_id IS NOT NULL THEN
            INSERT INTO notifications (user_id, type, title, body, link, actor_id, reference_id)
            VALUES (
                NEW.user_id,
                'registration_approved',
                'Cập nhật đơn ghi danh',
                'Đơn ghi danh của bạn đã được chuyển thành trạng thái: ' || 
                CASE 
                    WHEN NEW.status = 'approved' THEN 'Đã duyệt'
                    WHEN NEW.status = 'rejected' THEN 'Từ chối'
                    ELSE NEW.status
                END,
                '/admin/registrations',
                auth.uid(),
                NEW.id::text
            );
        END IF;

        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Gắn lại Trigger nếu bảng member_registrations tồn tại
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'member_registrations') THEN
        DROP TRIGGER IF EXISTS trg_notify_registration_changes ON member_registrations;
        CREATE TRIGGER trg_notify_registration_changes
        AFTER INSERT OR UPDATE ON member_registrations
        FOR EACH ROW EXECUTE FUNCTION notify_registration_changes();
    END IF;
END $$;
