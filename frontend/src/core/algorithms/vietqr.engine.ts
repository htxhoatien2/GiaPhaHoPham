/**
 * Dynamic VietQR (Napas247 / EMVCo) Payment & Clan Contribution Generator
 * Generates dynamic QuickLinks and standard banking transfer QR payloads
 */

import { VietQRPayload } from '../domain/types';

export class VietQREngine {
  /**
   * Supported major Vietnamese bank BIN codes
   */
  public static readonly BANK_BINS: Record<string, { code: string; name: string; shortName: string }> = {
    MB: { code: '970422', name: 'Ngân hàng TMCP Quân Đội', shortName: 'MBBank' },
    VCB: { code: '970436', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam', shortName: 'Vietcombank' },
    TCB: { code: '970407', name: 'Ngân hàng TMCP Kỹ Thương Việt Nam', shortName: 'Techcombank' },
    BIDV: { code: '970418', name: 'Ngân hàng TMCP Đầu Tư và Phát Triển Việt Nam', shortName: 'BIDV' },
    CTG: { code: '970415', name: 'Ngân hàng TMCP Công Thương Việt Nam', shortName: 'VietinBank' },
    ACB: { code: '970416', name: 'Ngân hàng TMCP Á Châu', shortName: 'ACB' },
    VPB: { code: '970432', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', shortName: 'VPBank' }
  };

  /**
   * Build VietQR QuickLink URL & Payload for clan fund contribution
   * @param bankBin Bank BIN (e.g., '970422' for MBBank)
   * @param accountNumber Bank Account Number
   * @param accountName Bank Account Holder Name
   * @param amount Optional transfer amount in VND
   * @param clanName Name of the Clan
   * @param donorName Name of the contributor
   * @param purpose Purpose of contribution ('khuyen_hoc' | 'tu_bo_nha_tho' | 'gio_to' | 'cong_duc')
   */
  public static generateVietQRPayload(
    bankBin: string,
    accountNumber: string,
    accountName: string,
    amount: number = 0,
    clanName: string = 'DONG HO',
    donorName: string = 'CON CHAU',
    purpose: string = 'KHUYEN HOC'
  ): VietQRPayload {
    // Normalize memo (no accent, uppercase for bank transfer compatibility)
    const cleanClan = this.removeAccents(clanName).toUpperCase().replace(/[^A-Z0-9]/g, ' ').trim();
    const cleanDonor = this.removeAccents(donorName).toUpperCase().replace(/[^A-Z0-9]/g, ' ').trim();
    const cleanPurpose = this.removeAccents(purpose).toUpperCase().replace(/[^A-Z0-9]/g, ' ').trim();

    const memo = `${cleanClan} ${cleanDonor} ${cleanPurpose}`.substring(0, 50);

    // Format QuickLink URL (VietQR API template 'compact2' or 'qr_only')
    const encodedMemo = encodeURIComponent(memo);
    const encodedAccountName = encodeURIComponent(accountName);
    const amountParam = amount > 0 ? `&amount=${amount}` : '';
    
    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?accountName=${encodedAccountName}&addInfo=${encodedMemo}${amountParam}`;

    return {
      bankBin,
      accountNumber,
      accountName,
      amount: amount > 0 ? amount : undefined,
      memo,
      qrUrl
    };
  }

  private static removeAccents(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }
}
