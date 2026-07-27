/**
 * @project AncestorTree
 * @file src/app/(main)/admin/registrations/actions.ts
 * @description Server Action to send registration emails using Node.js server environment
 * @version 1.0.0
 * @updated 2026-07-27
 */

'use server';

import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email-service';

export async function sendRegistrationEmailAction(params: {
  type: 'approved' | 'rejected';
  toEmail: string;
  fullName: string;
  personId?: string;
  reason?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { type, toEmail, fullName, personId, reason } = params;

    if (!toEmail || !toEmail.includes('@')) {
      return { success: false, error: 'Email không hợp lệ' };
    }

    const hasApiKey = Boolean(process.env.RESEND_API_KEY);
    if (!hasApiKey) {
      console.warn('[Email Action] RESEND_API_KEY is not defined in server process.env');
      return { success: false, error: 'Chưa nhận diện biến RESEND_API_KEY trên Server Vercel' };
    }

    let ok = false;
    if (type === 'approved') {
      ok = await sendApprovalEmail(toEmail, fullName, personId);
    } else {
      ok = await sendRejectionEmail(toEmail, fullName, reason || 'Thông tin chưa đạt yêu cầu');
    }

    if (!ok) {
      return { success: false, error: 'Gửi mail thất bại qua Resend API' };
    }

    return { success: true };
  } catch (err) {
    console.error('[Email Action Exception]:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi hệ thống khi gửi email',
    };
  }
}
