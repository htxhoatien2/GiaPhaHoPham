/**
 * Clan Genealogy Book Export Engine (.docx)
 * Builds formatted Microsoft Word Clan Book with Title Page, Preface, Lineage, and Bios
 */

import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { PersonEntity, ClanProfile } from '../domain/types';

export class BookExportEngine {
  /**
   * Generate Microsoft Word (.docx) document as a Blob or Buffer
   */
  public static async generateClanBookBlob(
    clan: ClanProfile,
    people: PersonEntity[]
  ): Promise<Blob> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title Page
            new Paragraph({
              text: 'GIA PHẢ ĐIỆN TỬ VIỆT NAM',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { before: 2000, after: 400 }
            }),
            new Paragraph({
              text: clan.fullName || `TỘC PHẢ ${clan.name.toUpperCase()}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '“Cây có cội mới nở cành xanh ngọn, Nước có nguồn mới bủa khắp rạch sông”',
                  italics: true
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 1200 }
            }),
            new Paragraph({
              text: `Năm lập phả: ${clan.foundingYear || new Date().getFullYear()}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 2000 }
            }),

            // Preface Section
            new Paragraph({
              text: 'I. LỜI TỰA & NGUỒN GỐC DÒNG TỘC',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 800, after: 400 }
            }),
            new Paragraph({
              text: clan.originStory || 'Dòng tộc có bề dày lịch sử truyền thống hiếu học, phụng sự quê hương đất nước.',
              spacing: { after: 600 }
            }),

            // Generations Section
            new Paragraph({
              text: 'II. PHẢ HỆ CHI TIẾT CÁC ĐỜI',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 800, after: 400 }
            }),
            ...this.buildPeopleParagraphs(people),

            // Clan Charter Section
            new Paragraph({
              text: 'III. HƯƠNG ƯỚC GIA TỘC',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 800, after: 400 }
            }),
            new Paragraph({
              text: clan.charter?.join('\n') || 'Con cháu trong gia tộc giữ gìn đạo hiếu, tương thân tương ái, khuyến học khuyến tài.',
              spacing: { after: 400 }
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  }

  private static buildPeopleParagraphs(people: PersonEntity[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    const sortedPeople = [...people].sort((a, b) => a.generation - b.generation);

    let currentGen = 0;
    for (const p of sortedPeople) {
      if (p.generation !== currentGen) {
        currentGen = p.generation;
        paragraphs.push(
          new Paragraph({
            text: `--- THẾ HỆ THỨ ${currentGen} ---`,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 400, after: 200 }
          })
        );
      }

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${p.fullName}`,
              bold: true
            }),
            new TextRun({
              text: ` (${p.gender === 'male' ? 'Nam' : 'Nữ'}${p.branchName ? ` - ${p.branchName}` : ''})`
            }),
            new TextRun({
              text: p.isAlive ? ' [Còn sống]' : ' [Đã tạ thế]'
            })
          ],
          spacing: { after: 100 }
        })
      );

      if (p.biography) {
        paragraphs.push(
          new Paragraph({
            text: `  Tiểu sử: ${p.biography}`,
            spacing: { after: 100 }
          })
        );
      }
    }

    return paragraphs;
  }
}
