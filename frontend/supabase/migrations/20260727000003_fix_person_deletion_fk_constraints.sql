-- ============================================================
-- Migration: Fix Foreign Key Constraints & RLS for Person Deletion
-- Ensures that deleting a person automatically sets referencing
-- columns (like member_registrations.person_id) to NULL, and
-- allows both Admins and Editors to delete people records.
-- ============================================================

-- 1. member_registrations (person_id -> people.id)
ALTER TABLE IF EXISTS member_registrations
  DROP CONSTRAINT IF EXISTS member_registrations_person_id_fkey;

ALTER TABLE IF EXISTS member_registrations
  ADD CONSTRAINT member_registrations_person_id_fkey
  FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE SET NULL;

-- 2. cau_duong_ancestors (ancestor_id -> people.id)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cau_duong_ancestors') THEN
    ALTER TABLE cau_duong_ancestors DROP CONSTRAINT IF EXISTS cau_duong_ancestors_ancestor_id_fkey;
    ALTER TABLE cau_duong_ancestors
      ADD CONSTRAINT cau_duong_ancestors_ancestor_id_fkey
      FOREIGN KEY (ancestor_id) REFERENCES people(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. RLS Policy: Allow both Admins and Editors to delete people
DROP POLICY IF EXISTS "Admins can delete people" ON people;
DROP POLICY IF EXISTS "Admins and editors can delete people" ON people;

CREATE POLICY "Admins and editors can delete people" ON people
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'editor')
        )
    );
