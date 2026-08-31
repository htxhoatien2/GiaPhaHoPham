/**
 * Core Domain Types & Entities for Vietnam Genealogy Management System
 * Designed for Clean Architecture & Commercial Portability
 */

export type Gender = 'male' | 'female' | 'other';
export type PrivacyLevel = 'public' | 'members_only' | 'private';
export type RegionDialect = 'north' | 'central' | 'south';

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  canChiYear: string;
  canChiMonth?: string;
  canChiDay?: string;
  solarDate: string; // YYYY-MM-DD
}

export interface PersonEntity {
  id: string;
  fullName: string;
  otherNames?: string[];
  gender: Gender;
  generation: number;
  branchName?: string; // Chi / Phái
  birthDateSolar?: string;
  birthDateLunar?: LunarDate;
  deathDateSolar?: string;
  deathDateLunar?: LunarDate;
  isAlive: boolean;
  burialPlace?: string; // Mộ táng
  fatherId?: string;
  motherId?: string;
  spouseIds?: string[];
  childIds?: string[];
  biography?: string;
  achievements?: string[];
  avatarUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  privacy: PrivacyLevel;
  sortOrder?: number;
}

export interface KinshipResult {
  term: string; // Tên xưng hô (e.g., 'Bác ruột', 'Chú ruột', 'Cô họ', 'Anh họ')
  addressSelf: string; // Tự xưng (e.g., 'Cháu', 'Em')
  degree: number; // Đời cách biệt
  relationPath: string[]; // ['cha', 'anh_trai']
  region: RegionDialect;
  explanation: string;
}

export interface CauDuongAssignment {
  year: number;
  lunarMonth: number;
  dutyType: 'chinh_te' | 'boi_te' | 'phan_cong';
  assignedPersonId: string;
  assignedPersonName: string;
  branch: string;
  generation: number;
  notes?: string;
}

export interface VietQRPayload {
  bankBin: string; // e.g. '970422' (MBBank)
  accountNumber: string;
  accountName: string;
  amount?: number;
  memo: string; // e.g. "GIAPHA NGUYEN VAN A KHUYEN HOC"
  qrUrl: string; // QuickLink API URL
}

export interface ClanProfile {
  id: string;
  name: string; // e.g., "Phạm Văn"
  fullName: string; // e.g., "Gia Phả Dòng Họ Phạm Văn - An Trạch"
  foundingYear?: number;
  ancestralHallAddress?: string;
  originStory?: string;
  charter?: string[]; // Hương ước
  logoUrl?: string;
  bannerUrl?: string;
  bankInfo?: {
    bankName: string;
    bankBin: string;
    accountNumber: string;
    accountHolder: string;
  };
}
