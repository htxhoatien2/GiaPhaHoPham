/**
 * 3-Region Vietnamese Kinship Calculation Engine
 * Handles Northern, Central (Quảng Nam/Đà Nẵng), and Southern dialects
 * Respects "Cành Bác - Cành Chú" (seniority of branch vs chronological age)
 */

import { KinshipResult, RegionDialect } from '../domain/types';

export class KinshipEngine {
  /**
   * Determine the kinship addressing between Person A and Person B
   * @param genDiff generation(B) - generation(A) (e.g. 0: same gen, 1: B is child of A, -1: B is parent gen)
   * @param isSeniorBranch true if B belongs to an elder branch (Cành Bác)
   * @param genderB gender of target person ('male' | 'female')
   * @param region dialect region ('north' | 'central' | 'south')
   * @param ageDiff age(B) - age(A) in years
   */
  public static calculateKinship(
    genDiff: number,
    isSeniorBranch: boolean,
    genderB: 'male' | 'female',
    region: RegionDialect = 'central',
    ageDiff: number = 0
  ): KinshipResult {
    // 1. Same Generation (genDiff === 0)
    if (genDiff === 0) {
      if (isSeniorBranch) {
        const term = genderB === 'male' ? 'Anh họ (Cành trên)' : 'Chị họ (Cành trên)';
        const addressSelf = 'Em';
        return {
          term,
          addressSelf,
          degree: 0,
          relationPath: ['đồng_thế_hệ', isSeniorBranch ? 'cành_bác' : 'cành_chú'],
          region,
          explanation: `Do thuộc cành trên (Cành Bác), dù nhỏ tuổi hơn theo năm sinh vẫn xưng là "${term}".`
        };
      } else {
        const term = ageDiff >= 0 
          ? (genderB === 'male' ? 'Anh' : 'Chị') 
          : (genderB === 'male' ? 'Em trai' : 'Em gái');
        return {
          term,
          addressSelf: ageDiff >= 0 ? 'Em' : 'Anh/Chị',
          degree: 0,
          relationPath: ['đồng_thế_hệ'],
          region,
          explanation: 'Cùng thế hệ trong gia tộc.'
        };
      }
    }

    // 2. Target is 1 Generation Higher (genDiff === -1)
    if (genDiff === -1) {
      if (isSeniorBranch) {
        const term = genderB === 'male' ? 'Bác trai' : 'Bác gái';
        return {
          term,
          addressSelf: 'Cháu',
          degree: 1,
          relationPath: ['bậc_cha_chú', 'cành_bác'],
          region,
          explanation: 'Bậc cha chú thuộc chi trưởng/cành bác.'
        };
      } else {
        let term = '';
        if (region === 'central') {
          term = genderB === 'male' ? 'Chú' : 'Cô (O)';
        } else if (region === 'south') {
          term = genderB === 'male' ? 'Chú / Cậu' : 'Cô / Dì';
        } else {
          term = genderB === 'male' ? 'Chú' : 'Cô';
        }
        return {
          term,
          addressSelf: 'Cháu',
          degree: 1,
          relationPath: ['bậc_cha_chú', 'cành_chú'],
          region,
          explanation: 'Bậc cha chú thuộc cành em.'
        };
      }
    }

    // 3. Target is 2 Generations Higher (genDiff === -2)
    if (genDiff === -2) {
      const term = genderB === 'male' ? 'Ông' : 'Bà';
      const suffix = isSeniorBranch ? ' (Ông/Bà Bác)' : ' (Ông/Bà Chú)';
      return {
        term: term + suffix,
        addressSelf: 'Cháu',
        degree: 2,
        relationPath: ['bậc_ông_bà'],
        region,
        explanation: 'Bậc ông bà trong dòng họ.'
      };
    }

    // 4. Target is 3+ Generations Higher (genDiff <= -3)
    if (genDiff <= -3) {
      const term = genderB === 'male' ? 'Cụ / Cố' : 'Cụ bà / Cố';
      return {
        term,
        addressSelf: 'Chắt / Chút',
        degree: Math.abs(genDiff),
        relationPath: ['bậc_tiền_bối_cao'],
        region,
        explanation: 'Bậc cao tằng tổ tiên trong gia tộc.'
      };
    }

    // 5. Target is Lower Generation (genDiff >= 1)
    const term = genDiff === 1 ? 'Cháu' : genDiff === 2 ? 'Chắt' : 'Chút / Chít';
    return {
      term,
      addressSelf: isSeniorBranch ? 'Bác / Ông Bác' : 'Chú / Ông Chú',
      degree: genDiff,
      relationPath: ['hậu_duệ'],
      region,
      explanation: 'Hậu duệ thuộc các thế hệ sau.'
    };
  }
}
