/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/lib/clan-config.ts
 * @description Clan name configuration from environment variables
 * @version 1.1.0
 * @updated 2026-07-23
 */

// Short clan name (e.g. "Tộc Phạm Văn")
export const CLAN_NAME = process.env.NEXT_PUBLIC_CLAN_NAME || 'Tộc Phạm Văn';

// Full clan name with location (e.g. "Tộc Phạm Văn An Trạch")
export const CLAN_FULL_NAME = process.env.NEXT_PUBLIC_CLAN_FULL_NAME || 'Tộc Phạm Văn An Trạch';

// Derived: first letter of the family surname (e.g. "P" from "Tộc Phạm Văn")
const parts = CLAN_NAME.split(' ');
export const CLAN_INITIAL = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][0];

// Derived: location subtitle (e.g. "An Trạch")
export const CLAN_SUBTITLE = CLAN_FULL_NAME.startsWith(CLAN_NAME)
  ? CLAN_FULL_NAME.slice(CLAN_NAME.length).trim()
  : 'An Trạch';
