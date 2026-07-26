-- ============================================================
-- Migration: Fix Foreign Key Constraints & RLS for User Deletion
-- Ensures that deleting a user or profile automatically sets 
-- referencing columns to NULL and permits admins to delete profiles.
-- ============================================================

-- 1. fund_transactions (created_by -> profiles.id)
ALTER TABLE IF EXISTS fund_transactions
  DROP CONSTRAINT IF EXISTS fund_transactions_created_by_fkey;

ALTER TABLE IF EXISTS fund_transactions
  ADD CONSTRAINT fund_transactions_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- 2. scholarships (approved_by -> profiles.id)
ALTER TABLE IF EXISTS scholarships
  DROP CONSTRAINT IF EXISTS scholarships_approved_by_fkey;

ALTER TABLE IF EXISTS scholarships
  ADD CONSTRAINT scholarships_approved_by_fkey
  FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- 3. clan_articles (author_id -> profiles.id)
ALTER TABLE IF EXISTS clan_articles
  DROP CONSTRAINT IF EXISTS clan_articles_author_id_fkey;

ALTER TABLE IF EXISTS clan_articles
  ADD CONSTRAINT clan_articles_author_id_fkey
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- 4. member_registrations (reviewed_by -> auth.users.id)
ALTER TABLE IF EXISTS member_registrations
  DROP CONSTRAINT IF EXISTS member_registrations_reviewed_by_fkey;

ALTER TABLE IF EXISTS member_registrations
  ADD CONSTRAINT member_registrations_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 5. Add RLS policy allowing admins to delete profile rows
DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;
CREATE POLICY "Admins can delete any profile" ON profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid() 
            AND p.role = 'admin'
        )
    );
