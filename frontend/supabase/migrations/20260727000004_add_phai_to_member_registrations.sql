-- ============================================================
-- Migration: Add phai column to member_registrations
-- Ensures Phái is captured during member registration and 
-- synchronized smoothly to the people table upon approval.
-- ============================================================

ALTER TABLE IF EXISTS member_registrations
  ADD COLUMN IF NOT EXISTS phai INTEGER;

COMMENT ON COLUMN member_registrations.phai IS 'Phái tộc (sub-branch index) declared during registration';
