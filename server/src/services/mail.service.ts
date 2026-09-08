import fs from 'fs';
import path from 'path';
import { transporter, isSmtpConfigured, verifyMailer, buildTransporter } from '../config/mailer';
import { env } from '../config/env';

export interface DispatchedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  type: 'AUTH_OTP' | 'INTERVIEW_INVITATION' | 'TEAM_INVITATION' | 'STAGE_UPDATE' | 'APPLICATION_RECEIVED' | 'TEST';
  status: 'DELIVERED' | 'FAILED' | 'DEV_SIMULATED';
  error?: string;
  messageId?: string;
  createdAt: string;
}

// In-memory Outbox keeping the last 100 emails for instant inspection in dev & production
const outbox: DispatchedEmail[] = [];

export class MailService {
  /**
   * Dispatch an email and record in the live outbox
   */
  static async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    type?: DispatchedEmail['type'];
  }): Promise<DispatchedEmail> {
    const { to, subject, html, text, type = 'STAGE_UPDATE' } = params;
    const emailId = `mail_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const sender = env.EMAIL_FROM || env.SMTP_USER || 'Hire ATS <notifications@hire-ats.local>';
    const configured = isSmtpConfigured();

    const emailRecord: DispatchedEmail = {
      id: emailId,
      from: sender,
      to,
      subject,
      html,
      text,
      type,
      status: 'DEV_SIMULATED',
      createdAt: new Date().toISOString(),
    };

    // Prepend to outbox
    outbox.unshift(emailRecord);
    if (outbox.length > 100) outbox.pop();

    if (!configured) {
      emailRecord.status = 'DEV_SIMULATED';
      emailRecord.error =
        'Real SMTP credentials not configured in server/.env (SMTP_USER/SMTP_PASS are empty). Email simulated & visible in ATS Outbox.';

      console.log(`
┌────────────────────────────────────────────────────────────────────────┐
│ 📬 EMAIL DISPATCH LOG (DEV SIMULATOR)                                   │
├────────────────────────────────────────────────────────────────────────┤
│ 📤 SENDER (الراسل):    ${sender}
│ 📥 TO (المرسل إليه):   ${to}
│ 📋 SUBJECT (العنوان):  ${subject}
│ 🏷️ TYPE (الحدث):       ${type}
│ ⚡ STATUS (الحالة):     🟡 DEV_SIMULATED (Not sent to internet - In Outbox)
│ 💡 WHY (السبب):        SMTP_USER / SMTP_PASS empty in server/.env
│ 🕒 TIME (الوقت):       ${new Date().toLocaleTimeString()} (${new Date().toLocaleDateString()})
└────────────────────────────────────────────────────────────────────────┘
👉 Note: Configure server/.env (SMTP_USER & SMTP_PASS) to deliver real emails to inboxes.
`);
      return emailRecord;
    }

    try {
      const logoPath = path.resolve(__dirname, '../../assets/kader-logo.png');
      const attachments: Array<{ filename: string; path: string; cid: string }> = [];
      let finalHtml = html;

      if (fs.existsSync(logoPath)) {
        attachments.push({
          filename: 'kader-logo.png',
          path: logoPath,
          cid: 'kader-logo@hire-ats',
        });
      } else {
        // Fallback for Serverless Lambda where local filesystem assets are not bundled
        const publicLogoUrl = 'https://kader-teal.vercel.app/kader-logo.png';
        finalHtml = finalHtml.replace(/cid:kader-logo@hire-ats/g, publicLogoUrl);
      }

      const activeTransporter = buildTransporter();
      const info = await activeTransporter.sendMail({
        from: sender,
        to,
        subject,
        html: finalHtml,
        text,
        attachments,
      });

      emailRecord.status = 'DELIVERED';
      emailRecord.messageId = info.messageId;

      console.log(`
┌────────────────────────────────────────────────────────────────────────┐
│ ✉️ REAL EMAIL DELIVERED TO INBOX!                                      │
├────────────────────────────────────────────────────────────────────────┤
│ 📤 SENDER (الراسل):    ${sender}
│ 📥 TO (المرسل إليه):   ${to}
│ 📋 SUBJECT (العنوان):  ${subject}
│ 🏷️ TYPE (الحدث):       ${type}
│ ⚡ STATUS (الحالة):     🟢 DELIVERED (Delivered via SMTP successfully)
│ 🆔 MESSAGE ID:         ${info.messageId}
│ 🕒 TIME (الوقت):       ${new Date().toLocaleTimeString()} (${new Date().toLocaleDateString()})
└────────────────────────────────────────────────────────────────────────┘
`);
    } catch (err) {
      const errorMsg = (err as Error).message;
      emailRecord.status = 'FAILED';
      emailRecord.error = errorMsg;

      console.warn(`
┌────────────────────────────────────────────────────────────────────────┐
│ ⚠️ EMAIL DELIVERY FAILED!                                              │
├────────────────────────────────────────────────────────────────────────┤
│ 📤 SENDER (الراسل):    ${sender}
│ 📥 TO (المرسل إليه):   ${to}
│ 📋 SUBJECT (العنوان):  ${subject}
│ ⚡ STATUS (الحالة):     🔴 FAILED (SMTP Rejected or Connection Error)
│ ❌ ERROR (الخطأ):      ${errorMsg}
│ 🕒 TIME (الوقت):       ${new Date().toLocaleTimeString()}
└────────────────────────────────────────────────────────────────────────┘
`);
    }

    return emailRecord;
  }

  /**
   * Get recent dispatched emails
   */
  static getOutbox(): DispatchedEmail[] {
    return outbox;
  }

  /**
   * Clear outbox
   */
  static clearOutbox(): void {
    outbox.length = 0;
  }

  /**
   * Test SMTP configuration with a real test email
   */
  static async testSmtp(toEmail: string): Promise<{
    success: boolean;
    connected: boolean;
    message: string;
    details?: string;
  }> {
    const check = await verifyMailer();
    if (!check.connected) {
      return {
        success: false,
        connected: false,
        message: check.message,
      };
    }

    try {
      const testRecord = await this.sendEmail({
        to: toEmail,
        subject: 'Hire ATS — SMTP Test Email (تجربة إرسال الإيميل)',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; direction: rtl; text-align: right;">
            <h2 style="color: #10b981; margin-top: 0;">تم الاتصال بخادم البريد بنجاح!</h2>
            <p style="color: #cbd5e1;">تهانينا! نظام البريد في Hire ATS متصل بنجاح ويرسل الإيميلات الحقيقية إلى بريدك مباشرة باللغة العربية ومحاذاة RTL.</p>
            <div style="background: #1e293b; padding: 12px 16px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 13px; color: #38bdf8; text-align: left; direction: ltr;">
              Sender: ${env.EMAIL_FROM}<br/>
              Target: ${toEmail}<br/>
              Timestamp: ${new Date().toLocaleString()}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Hire ATS Platform</p>
          </div>
        `,
        type: 'TEST',
      });

      if (testRecord.status === 'DELIVERED') {
        return {
          success: true,
          connected: true,
          message: `Test email successfully delivered to ${toEmail}! Check your inbox.`,
        };
      } else {
        return {
          success: false,
          connected: true,
          message: `Connection established, but sending failed: ${testRecord.error}`,
          details: testRecord.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        connected: false,
        message: `Error sending test email: ${(error as Error).message}`,
      };
    }
  }
}
