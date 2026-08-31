import { describe, it, expect } from 'vitest';
import { LunarSolarEngine } from '../algorithms/lunar-solar.engine';
import { KinshipEngine } from '../algorithms/kinship.engine';
import { CauDuongEngine } from '../algorithms/cau-duong.engine';
import { GedcomV7Engine } from '../algorithms/gedcom-v7.engine';
import { VietQREngine } from '../algorithms/vietqr.engine';
import { PersonEntity, ClanProfile } from '../domain/types';

describe('Core Domain Engines Unit Tests (Clean Architecture)', () => {
  // 1. Lunar Solar Engine Tests
  describe('LunarSolarEngine', () => {
    it('calculates accurate Can Chi for years', () => {
      expect(LunarSolarEngine.getYearCanChi(2024)).toBe('Giáp Thìn');
      expect(LunarSolarEngine.getYearCanChi(2025)).toBe('Ất Tỵ');
      expect(LunarSolarEngine.getYearCanChi(2026)).toBe('Bính Ngọ');
    });

    it('converts solar date to lunar date structure', () => {
      const lunar = LunarSolarEngine.solarToLunar(10, 2, 2024);
      expect(lunar).toBeDefined();
      expect(lunar.year).toBe(2024);
      expect(lunar.canChiYear).toBe('Giáp Thìn');
    });

    it('calculates next death anniversary countdown', () => {
      const anniversary = LunarSolarEngine.getNextAnniversary(15, 8);
      expect(anniversary.daysRemaining).toBeGreaterThanOrEqual(0);
    });
  });

  // 2. Kinship Engine Tests
  describe('KinshipEngine', () => {
    it('handles same generation with Cành Bác / Cành Chú', () => {
      const resultSenior = KinshipEngine.calculateKinship(0, true, 'male', 'central');
      expect(resultSenior.term).toContain('Anh họ');
      expect(resultSenior.addressSelf).toBe('Em');

      const resultJunior = KinshipEngine.calculateKinship(0, false, 'male', 'central', 5);
      expect(resultJunior.term).toBe('Anh');
    });

    it('handles parent generation (genDiff = -1) with 3-region variants', () => {
      const north = KinshipEngine.calculateKinship(-1, false, 'female', 'north');
      expect(north.term).toBe('Cô');

      const central = KinshipEngine.calculateKinship(-1, false, 'female', 'central');
      expect(central.term).toContain('Cô');

      const seniorUncle = KinshipEngine.calculateKinship(-1, true, 'male', 'central');
      expect(seniorUncle.term).toBe('Bác trai');
    });

    it('handles grandparent generation (genDiff = -2)', () => {
      const grandfather = KinshipEngine.calculateKinship(-2, true, 'male', 'central');
      expect(grandfather.term).toContain('Ông (Ông/Bà Bác)');
      expect(grandfather.addressSelf).toBe('Cháu');
    });
  });

  // 3. Cau Duong Scheduler Engine Tests
  describe('CauDuongEngine', () => {
    const mockPeople: PersonEntity[] = [
      { id: '1', fullName: 'Phạm Văn Trưởng', gender: 'male', generation: 3, isAlive: true, privacy: 'public', sortOrder: 1 },
      { id: '2', fullName: 'Phạm Văn Thứ', gender: 'male', generation: 3, isAlive: true, privacy: 'public', sortOrder: 2 },
      { id: '3', fullName: 'Phạm Văn Tam', gender: 'male', generation: 3, isAlive: true, privacy: 'public', sortOrder: 3 }
    ];

    it('generates non-empty schedule for target year', () => {
      const schedule = CauDuongEngine.generateSchedule(mockPeople, 2026, [1, 2, 7, 12]);
      expect(schedule).toHaveLength(4);
      expect(schedule[0].dutyType).toBe('chinh_te');
      expect(schedule[1].dutyType).toBe('boi_te');
      expect(schedule[0].year).toBe(2026);
    });
  });

  // 4. GEDCOM 7.0 Engine Tests
  describe('GedcomV7Engine', () => {
    const mockPeople: PersonEntity[] = [
      {
        id: 'P01',
        fullName: 'Phạm Văn Tiên Khởi',
        gender: 'male',
        generation: 1,
        isAlive: false,
        birthDateSolar: '1750-01-01',
        deathDateSolar: '1820-05-15',
        burialPlace: 'An Trạch, Đà Nẵng',
        biography: 'Thủy tổ tiền hiền',
        privacy: 'public'
      }
    ];

    it('exports valid GEDCOM 7.0 formatted string', () => {
      const gedcom = GedcomV7Engine.exportToGedcom7('Họ Phạm Văn', mockPeople);
      expect(gedcom).toContain('0 HEAD');
      expect(gedcom).toContain('2 VERS 7.0');
      expect(gedcom).toContain('0 @IP01@ INDI');
      expect(gedcom).toContain('1 NAME Phạm Văn Tiên Khởi');
      expect(gedcom).toContain('0 TRLR');
    });

    it('parses GEDCOM text back to Person entities', () => {
      const gedcomText = `0 HEAD\n1 GEDC\n2 VERS 7.0\n0 @I99@ INDI\n1 NAME Nguyễn Văn Test\n1 SEX M\n2 DATE 1990-01-01\n0 TRLR`;
      const parsed = GedcomV7Engine.parseGedcom(gedcomText);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].fullName).toBe('Nguyễn Văn Test');
      expect(parsed[0].gender).toBe('male');
    });
  });

  // 5. VietQR Engine Tests
  describe('VietQREngine', () => {
    it('generates valid VietQR QuickLink and cleaned memo', () => {
      const payload = VietQREngine.generateVietQRPayload(
        '970422',
        '0123456789',
        'PHAM VAN A',
        500000,
        'Họ Phạm Văn',
        'Phạm Văn Tuấn',
        'Khuyến Học 2026'
      );

      expect(payload.bankBin).toBe('970422');
      expect(payload.accountNumber).toBe('0123456789');
      expect(payload.amount).toBe(500000);
      expect(payload.memo).toBe('HO PHAM VAN PHAM VAN TUAN KHUYEN HOC 2026');
      expect(payload.qrUrl).toContain('https://img.vietqr.io/image/970422-0123456789-compact2.png');
      expect(payload.qrUrl).toContain('amount=500000');
    });
  });
});
