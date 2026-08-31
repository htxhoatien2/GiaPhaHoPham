/**
 * GEDCOM 7.0 & 5.5.1 International Genealogy Standard Engine
 * Supports importing & exporting family trees with full Vietnamese UTF-8 encoding
 */

import { PersonEntity } from '../domain/types';

export class GedcomV7Engine {
  /**
   * Export a list of clan members to a standard GEDCOM 7.0 string
   */
  public static exportToGedcom7(clanName: string, people: PersonEntity[]): string {
    const lines: string[] = [
      '0 HEAD',
      '1 GEDC',
      '2 VERS 7.0',
      '2 FORM LINEAGE-LINKED',
      '1 SOUR GIAPHASO_ANCESTORTREE',
      '2 NAME Gia Phả Số (AncestorTree)',
      '2 VERS 3.0',
      '1 CORP Gia Phả Điện Tử Việt Nam',
      '1 LANG vie',
      '1 CHAR UTF-8',
      `1 NOTE Phả hệ dòng họ: ${clanName}`
    ];

    // Export Individuals (INDI)
    for (const p of people) {
      lines.push(`0 @I${p.id}@ INDI`);
      lines.push(`1 NAME ${p.fullName}`);
      lines.push(`1 SEX ${p.gender === 'male' ? 'M' : p.gender === 'female' ? 'F' : 'U'}`);
      
      if (p.birthDateSolar) {
        lines.push('1 BIRT');
        lines.push(`2 DATE ${p.birthDateSolar}`);
      }
      
      if (!p.isAlive && p.deathDateSolar) {
        lines.push('1 DEAT');
        lines.push(`2 DATE ${p.deathDateSolar}`);
        if (p.burialPlace) {
          lines.push(`2 PLAC ${p.burialPlace}`);
        }
      }
      
      if (p.biography) {
        lines.push(`1 NOTE ${p.biography.replace(/\n/g, ' ')}`);
      }
      
      if (p.fatherId || p.motherId) {
        lines.push(`1 FAMC @F_PARENTS_${p.id}@`);
      }
    }

    // Export Families (FAM)
    const processedFamilies = new Set<string>();
    for (const p of people) {
      if (p.spouseIds && p.spouseIds.length > 0) {
        for (const spouseId of p.spouseIds) {
          const famKey = [p.id, spouseId].sort().join('_');
          if (!processedFamilies.has(famKey)) {
            processedFamilies.add(famKey);
            lines.push(`0 @F_${famKey}@ FAM`);
            if (p.gender === 'male') {
              lines.push(`1 HUSB @I${p.id}@`);
              lines.push(`1 WIFE @I${spouseId}@`);
            } else {
              lines.push(`1 HUSB @I${spouseId}@`);
              lines.push(`1 WIFE @I${p.id}@`);
            }
            if (p.childIds) {
              for (const childId of p.childIds) {
                lines.push(`1 CHIL @I${childId}@`);
              }
            }
          }
        }
      }
    }

    lines.push('0 TRLR');
    return lines.join('\n');
  }

  /**
   * Parse a basic GEDCOM text file into Person entities
   */
  public static parseGedcom(gedcomText: string): Partial<PersonEntity>[] {
    const lines = gedcomText.split(/\r?\n/);
    const people: Partial<PersonEntity>[] = [];
    let currentPerson: Partial<PersonEntity> | null = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const matchIndi = line.match(/^0 @I?([A-Za-z0-9_-]+)@ INDI$/i);
      if (matchIndi) {
        if (currentPerson && currentPerson.fullName) {
          people.push(currentPerson);
        }
        currentPerson = {
          id: matchIndi[1],
          gender: 'male',
          generation: 1,
          isAlive: true,
          privacy: 'members_only'
        };
        continue;
      }

      if (currentPerson) {
        if (line.startsWith('1 NAME ')) {
          currentPerson.fullName = line.substring(7).replace(/\//g, '').trim();
        } else if (line.startsWith('1 SEX ')) {
          const sex = line.substring(6).trim().toUpperCase();
          currentPerson.gender = sex === 'M' ? 'male' : sex === 'F' ? 'female' : 'other';
        } else if (line.startsWith('2 DATE ')) {
          const dateStr = line.substring(7).trim();
          if (!currentPerson.birthDateSolar) {
            currentPerson.birthDateSolar = dateStr;
          }
        }
      }
    }

    if (currentPerson && currentPerson.fullName) {
      people.push(currentPerson);
    }

    return people;
  }
}
