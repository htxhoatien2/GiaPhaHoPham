/**
 * @project AncestorTree
 * @file src/lib/email-service.ts
 * @description Email notification service for member registration approval & rejection
 * @version 1.0.0
 * @updated 2026-07-27
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Gia Phả Họ Phạm <onboarding@resend.dev>',
          to: [to],
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[Email Service] Resend API error:', errText);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Email Service] Failed to send email via Resend:', err);
      return false;
    }
  }

  // Simulation log when RESEND_API_KEY is not set
  console.log(`[Email Service Simulation] Sent email to: ${to} | Subject: "${subject}"`);
  return true;
}

/**
 * Send approval confirmation email to registrant
 */
export async function sendApprovalEmail(toEmail: string, fullName: string, personId?: string): Promise<boolean> {
  if (!toEmail || !toEmail.includes('@')) return false;

  const subject = `[Gia Phả Họ Phạm] 🎉 Đơn ghi danh của bạn đã được phê duyệt!`;
  const treeUrl = `https://giaphaphamvan.vercel.app${personId ? `/people/${personId}` : '/tree'}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #059669;">
        <h1 style="color: #065f46; font-size: 24px; margin: 0; font-weight: 800;">GIA PHẢ HỌ PHẠM VĂN</h1>
        <p style="color: #059669; font-size: 13px; margin-top: 4px; font-weight: 600;">Cây Gia Phả Điện Tử — Kết Nối Con Cháu Dòng Họ</p>
      </div>

      <div style="padding: 24px 0; color: #1e293b; line-height: 1.6;">
        <h2 style="color: #047857; font-size: 18px;">Xin chào ${fullName},</h2>
        <p>Ban quản trị dòng họ Phạm Văn xin trân trọng thông báo: <strong>Đơn ghi danh gia nhập gia phả</strong> của bạn đã được đối chiếu và <span style="color: #059669; font-weight: bold;">PHÊ DUYỆT THÀNH CÔNG</span>!</p>
        
        <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #065f46; font-weight: 600;">Thông tin của bạn đã chính thức được đưa vào Cây Gia Phả Điện Tử của Dòng Họ.</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${treeUrl}" style="background-color: #059669; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);">
            Xem Hồ Sơ Trên Gia Phả
          </a>
        </div>

        <p style="font-size: 13px; color: #64748b;">Nếu bạn có thêm thông tin hình ảnh, tư liệu gia đình, xin vui lòng gửi bổ sung cho Ban Quản Trị dòng họ.</p>
      </div>

      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
        <p>© Gia Phả Họ Phạm Văn. Email được gửi tự động từ hệ thống.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: toEmail, subject, html });
}

/**
 * Send rejection confirmation email to registrant
 */
export async function sendRejectionEmail(toEmail: string, fullName: string, reason: string): Promise<boolean> {
  if (!toEmail || !toEmail.includes('@')) return false;

  const subject = `[Gia Phả Họ Phạm] Thông báo kết quả đơn ghi danh gia phả`;
  const registerUrl = `https://giaphaphamvan.vercel.app/register-member`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #dc2626;">
        <h1 style="color: #991b1b; font-size: 24px; margin: 0; font-weight: 800;">GIA PHẢ HỌ PHẠM VĂN</h1>
        <p style="color: #dc2626; font-size: 13px; margin-top: 4px; font-weight: 600;">Cây Gia Phả Điện Tử — Kết Nối Con Cháu Dòng Họ</p>
      </div>

      <div style="padding: 24px 0; color: #1e293b; line-height: 1.6;">
        <h2 style="color: #991b1b; font-size: 18px;">Xin chào ${fullName},</h2>
        <p>Ban quản trị dòng họ đã xem xét đơn ghi danh của bạn nhưng tạm thời <span style="color: #dc2626; font-weight: bold;">chưa thể phê duyệt</span> vì lý do sau:</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b; font-weight: 600;">Lý do: ${reason}</p>
        </div>

        <p>Bạn có thể bổ sung thêm thông tin chi tiết (tên cha/mẹ, chi tộc, câu hỏi gia đình...) và gửi lại đơn đăng ký mới tại liên kết bên dưới:</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${registerUrl}" style="background-color: #475569; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Gửi Lại Đơn Đăng Ký
          </a>
        </div>
      </div>

      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
        <p>© Gia Phả Họ Phạm Văn. Email được gửi tự động từ hệ thống.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: toEmail, subject, html });
}
