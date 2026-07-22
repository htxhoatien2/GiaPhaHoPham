-- ============================================================================
-- Sprint 21: Thông báo Cập nhật Thành viên — Member Page Update Notifications
-- AncestorTree v2.8.5
-- ============================================================================

-- ─── 1. Expand notification types ──────────────────────────────────────────

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
    CHECK (type IN (
        'post_comment', 'post_like', 'new_post',
        'account_verified', 'event_reminder',
        'new_member', 'member_updated', 'member_deleted',
        'registration_submitted', 'registration_approved',
        'system'
    ));

-- ─── 2. Update RLS Policy for direct/app inserts ────────────────────────────

DROP POLICY IF EXISTS "No direct insert (triggers only)" ON notifications;

CREATE POLICY "Authenticated users and triggers can insert notifications"
ON notifications FOR INSERT TO authenticated
WITH CHECK (true);

-- ─── 3. Trigger Function: notify on member (people) changes ───────────────

CREATE OR REPLACE FUNCTION notify_people_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_actor UUID;
BEGIN
    current_actor := auth.uid();

    IF (TG_OP = 'INSERT') THEN
        INSERT INTO notifications (user_id, type, title, body, link, actor_id, reference_id)
        SELECT
            u.id,
            'new_member',
            'Thành viên mới',
            'Thành viên mới ' || NEW.display_name || ' đã được thêm vào gia phả.',
            '/people/' || NEW.id,
            current_actor,
            NEW.id::text
        FROM auth.users u
        WHERE current_actor IS NULL OR u.id != current_actor;

        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO notifications (user_id, type, title, body, link, actor_id, reference_id)
        SELECT
            u.id,
            'member_updated',
            'Cập nhật thành viên',
            'Thông tin thành viên ' || NEW.display_name || ' đã được cập nhật.',
            '/people/' || NEW.id,
            current_actor,
            NEW.id::text
        FROM auth.users u
        WHERE current_actor IS NULL OR u.id != current_actor;

        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO notifications (user_id, type, title, body, link, actor_id, reference_id)
        SELECT
            u.id,
            'member_deleted',
            'Xóa thành viên',
            'Thành viên ' || OLD.display_name || ' đã được xóa khỏi gia phả.',
            '/people',
            current_actor,
            OLD.id::text
        FROM auth.users u
        WHERE current_actor IS NULL OR u.id != current_actor;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notify_people_changes ON people;

CREATE TRIGGER trg_notify_people_changes
AFTER INSERT OR UPDATE OR DELETE ON people
FOR EACH ROW EXECUTE FUNCTION notify_people_changes();

-- ─── 4. Trigger Function: notify on member registration changes ────────────

CREATE OR REPLACE FUNCTION notify_registration_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Notify all admins about new member registration
        INSERT INTO notifications (user_id, type, title, body, link, actor_id, reference_id)
        SELECT
            p.user_id,
            'registration_submitted',
            'Đơn ghi danh mới',
            NEW.full_name || ' đã gửi đơn ghi danh gia phả.',
            '/admin/registrations',
            NEW.user_id,
            NEW.id::text
        FROM profiles p
        WHERE p.role = 'admin' AND p.user_id IS NOT NULL;

        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
        -- Notify the registering user about status update
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

DROP TRIGGER IF EXISTS trg_notify_registration_changes ON member_registrations;

-- Check if member_registrations table exists before attaching trigger
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'member_registrations') THEN
        CREATE TRIGGER trg_notify_registration_changes
        AFTER INSERT OR UPDATE ON member_registrations
        FOR EACH ROW EXECUTE FUNCTION notify_registration_changes();
    END IF;
END $$;
