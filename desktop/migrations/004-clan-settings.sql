-- ═══════════════════════════════════════════════════════════════════════════
-- AncestorTree Desktop — Clan Settings
-- SQLite version of clan_settings (singleton table)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS clan_settings (
  id               TEXT PRIMARY KEY,
  clan_name        TEXT NOT NULL DEFAULT 'Họ Phạm Văn',
  clan_full_name   TEXT NOT NULL DEFAULT 'Họ Phạm Văn làng An Trạch',
  clan_founding_year INTEGER,
  clan_origin      TEXT,
  clan_patriarch   TEXT,
  clan_description TEXT,
  contact_email    TEXT,
  contact_phone    TEXT,
  updated_at       TEXT DEFAULT (datetime('now')),
  updated_by       TEXT
);

-- Seed default singleton row
INSERT OR IGNORE INTO clan_settings (id, clan_name, clan_full_name)
  VALUES ('00000000-0000-0000-0000-000000000001', 'Họ Phạm Văn', 'Họ Phạm Văn làng An Trạch');
