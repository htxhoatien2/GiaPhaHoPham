-- ============================================================
-- Migration: Purge ONLY test records & notifications of "Phạm Văn Sơn"
-- KEEPS "Phạm Vô Danh", "Phạm Thị Vô Danh", "Phạm Văn Minh" 100% INTACT!
-- ============================================================

-- 1. Delete notifications related to "Phạm Văn Sơn" only
DELETE FROM notifications 
WHERE title ILIKE '%Phạm Văn Sơn%'
   OR message ILIKE '%Phạm Văn Sơn%';

-- 2. Delete children table references for "Phạm Văn Sơn" test records only
DELETE FROM children 
WHERE person_id IN (
    SELECT id FROM people 
    WHERE display_name ILIKE '%Phạm Văn Sơn%'
);

-- 3. Delete member_registrations for "Phạm Văn Sơn" only
DELETE FROM member_registrations 
WHERE full_name ILIKE '%Phạm Văn Sơn%';

-- 4. Delete people table rows for "Phạm Văn Sơn" test records only
DELETE FROM people 
WHERE display_name ILIKE '%Phạm Văn Sơn%';
