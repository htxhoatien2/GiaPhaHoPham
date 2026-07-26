/**
 * @project AncestorTree
 * @file src/lib/supabase-data-clan-settings.ts
 * @description Robust Supabase data functions for clan settings with local storage fallback
 * @version 2.0.0
 * @updated 2026-03-25
 */

import { supabase } from './supabase';
import type { ClanSettings, UpdateClanSettingsInput } from '@/types';

const STORAGE_KEY = 'ancestortree_clan_settings_backup';

function getLocalBackup(): Partial<ClanSettings> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalBackup(data: Partial<ClanSettings>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalBackup() || {};
    const merged = { ...existing, ...data, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {}
}

/**
 * Get the clan settings (singleton row).
 * Merges DB data with local backup to prevent data loss if DB columns are missing on Supabase cloud.
 */
export async function getClanSettings(): Promise<ClanSettings | null> {
  let dbData: ClanSettings | null = null;

  try {
    const { data, error } = await supabase
      .from('clan_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      dbData = data as ClanSettings;
    }
  } catch (err) {
    console.warn('DB fetch error for clan_settings:', err);
  }

  if (!dbData && !localBackup) {
    return {
      id: '00000000-0000-0000-0000-000000000001',
      clan_name: 'Tộc Phạm Văn',
      clan_full_name: 'Tộc Phạm Văn An Trạch',
      clan_patriarch: 'Thủy Tổ Tộc Phạm Văn',
      clan_founding_year: undefined,
      clan_origin: 'An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng',
      clan_description: 'Gia phả điện tử Tộc Phạm Văn An Trạch — Gìn giữ tinh hoa, tiếp bước cha ông.',
      contact_email: 'pctuanit@gmail.com',
      contact_phone: '0916 199 945',
      council_members: [
        { name: 'Phạm Công Tuân', title: 'Trưởng Ban Quản Trị Phả Hệ' }
      ],
      clan_history: 'Tộc Phạm Văn An Trạch có lịch sử phát triển lâu đời qua nhiều thế hệ. Con cháu trong dòng họ luôn gìn giữ truyền thống hiếu học, gia phong và luôn hướng về tổ tiên nguồn cội.',
      clan_mission: 'Chuyển đổi số công tác lưu trữ phả hệ, giúp con cháu xa quê dễ dàng tra cứu thế thứ, gắn kết tình thân và tiếp nối truyền thống tốt đẹp của dòng họ.',
      ancestral_hall_address: 'An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng',
      ancestral_hall_history: 'Nhà thờ Tộc Phạm Văn là nơi phụng sự thờ tự Tiên tổ, quy tụ con cháu hàng năm vào các dịp giỗ tổ và lễ Tết truyền thống.',
      ceremony_schedule: [
        { title: 'Lễ Giỗ Tổ Tộc Phạm Văn', lunar_date: '15/1', solar_date: 'Rằm tháng Giêng', description: 'Lễ giỗ tổ niên tự hàng năm tại Từ Đường Tộc.' },
        { title: 'Lễ Tế Thu & Khuyến Học', lunar_date: '15/8', solar_date: 'Rằm tháng Tám', description: 'Tế thu dòng họ và tuyên dương khen thưởng con cháu đạt thành tích xuất sắc.' }
      ],
      login_config: { methods: ['email_password', 'email_otp'], otp_expiry_minutes: 15 },
      updated_at: new Date().toISOString(),
    } as ClanSettings;
  }

  const merged: ClanSettings = {
    id: dbData?.id || localBackup?.id || '00000000-0000-0000-0000-000000000001',
    clan_name: dbData?.clan_name || localBackup?.clan_name || 'Họ Phạm Văn',
    clan_full_name: dbData?.clan_full_name || localBackup?.clan_full_name || 'Họ Phạm Văn làng An Trạch',
    clan_founding_year: dbData?.clan_founding_year ?? localBackup?.clan_founding_year,
    clan_origin: dbData?.clan_origin ?? localBackup?.clan_origin,
    clan_patriarch: dbData?.clan_patriarch ?? localBackup?.clan_patriarch,
    clan_description: dbData?.clan_description ?? localBackup?.clan_description,
    contact_email: dbData?.contact_email ?? localBackup?.contact_email,
    contact_phone: dbData?.contact_phone ?? localBackup?.contact_phone,
    council_members: (dbData?.council_members && Array.isArray(dbData.council_members) && dbData.council_members.length > 0)
      ? dbData.council_members
      : (localBackup?.council_members ?? []),
    clan_history: dbData?.clan_history ?? localBackup?.clan_history,
    clan_mission: dbData?.clan_mission ?? localBackup?.clan_mission,
    ancestral_hall_address: dbData?.ancestral_hall_address ?? localBackup?.ancestral_hall_address,
    ancestral_hall_history: dbData?.ancestral_hall_history ?? localBackup?.ancestral_hall_history,
    ceremony_schedule: (dbData?.ceremony_schedule && Array.isArray(dbData.ceremony_schedule) && dbData.ceremony_schedule.length > 0)
      ? dbData.ceremony_schedule
      : (localBackup?.ceremony_schedule ?? []),
    login_config: dbData?.login_config ?? localBackup?.login_config ?? { methods: ['email_password', 'email_otp'], otp_expiry_minutes: 15 },
    updated_at: dbData?.updated_at || localBackup?.updated_at || new Date().toISOString(),
    updated_by: dbData?.updated_by || localBackup?.updated_by,
  };

  return merged;
}

/**
 * Update clan settings.
 * Saves to local backup first, then syncs to Supabase DB gracefully.
 */
export async function updateClanSettings(
  id: string,
  input: UpdateClanSettingsInput,
  userId?: string
): Promise<ClanSettings> {
  // 1. Immediately persist to localStorage backup
  saveLocalBackup(input as Partial<ClanSettings>);

  const updatePayload = {
    ...input,
    updated_at: new Date().toISOString(),
    ...(userId ? { updated_by: userId } : {}),
  };

  try {
    const { data, error } = await supabase
      .from('clan_settings')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.warn('Primary DB update notice for clan_settings:', error.message);

      // If missing column error on Supabase cloud, attempt fallback update of base fields
      const basePayload: Record<string, unknown> = { ...updatePayload };
      delete basePayload.ceremony_schedule;
      delete basePayload.council_members;
      delete basePayload.clan_history;
      delete basePayload.clan_mission;
      delete basePayload.ancestral_hall_address;
      delete basePayload.ancestral_hall_history;
      delete basePayload.login_config;

      await supabase
        .from('clan_settings')
        .update(basePayload)
        .eq('id', id);
    }
  } catch (err) {
    console.warn('Network or DB error during clan_settings update, local backup preserved:', err);
  }

  // Return merged settings guaranteed to retain ceremony_schedule & all fields
  const latest = await getClanSettings();
  return latest || ({
    id,
    clan_name: input.clan_name || 'Họ Phạm Văn',
    clan_full_name: input.clan_full_name || 'Họ Phạm Văn làng An Trạch',
    ...input,
    updated_at: new Date().toISOString(),
  } as ClanSettings);
}
