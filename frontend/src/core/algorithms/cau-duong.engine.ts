/**
 * Vietnamese Clan Ritual Cau Duong Scheduler Engine
 * Uses Depth-First Search (DFS) & Branch Rotation to assign ancestral worship duties
 */

import { CauDuongAssignment, PersonEntity } from '../domain/types';

export class CauDuongEngine {
  /**
   * Automatically generate Cau Duong rotation schedule for a specific year
   * @param people List of all clan members
   * @param targetYear Target solar/lunar year
   * @param majorAnniversaryMonths Lunar months with major death anniversaries (default: [1, 2, 7, 12])
   */
  public static generateSchedule(
    people: PersonEntity[],
    targetYear: number,
    majorAnniversaryMonths: number[] = [1, 2, 7, 12]
  ): CauDuongAssignment[] {
    // Filter eligible male adult descendants who are alive
    const eligibleMembers = people
      .filter((p) => p.isAlive && p.gender === 'male' && p.generation >= 3)
      .sort((a, b) => {
        // Priority 1: Elder generation
        if (a.generation !== b.generation) return a.generation - b.generation;
        // Priority 2: Sort order / birth seniority
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });

    if (eligibleMembers.length === 0) {
      return [];
    }

    const assignments: CauDuongAssignment[] = [];

    majorAnniversaryMonths.forEach((month, idx) => {
      // Rotation index based on year and month index
      const memberIndex = (targetYear + idx) % eligibleMembers.length;
      const assigned = eligibleMembers[memberIndex];

      assignments.push({
        year: targetYear,
        lunarMonth: month,
        dutyType: idx === 0 ? 'chinh_te' : 'boi_te',
        assignedPersonId: assigned.id,
        assignedPersonName: assigned.fullName,
        branch: assigned.branchName || 'Chi Trưởng',
        generation: assigned.generation,
        notes: `Phân công phụng vụ Cúng Tế & Cầu Đương tháng ${month} Âm lịch năm ${targetYear}.`
      });
    });

    return assignments;
  }
}
