/**
 * @project AncestorTree
 * @file supabase/migrations/20260725000000_add_phai_column.sql
 * @description Add phai (Phái tộc) column to people table
 * @version 1.0.0
 * @updated 2026-07-25
 */

ALTER TABLE people ADD COLUMN IF NOT EXISTS phai INTEGER;
