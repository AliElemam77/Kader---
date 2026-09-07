import nodemailer from 'nodemailer';
import { env } from './env';

export const isSmtpConfigured = (): boolean => {
  if (!env.SMTP_USER || !env.SMTP_PASS) return false;
  if (env.SMTP_USER.includes('your_') || env.SMTP_PASS.includes('your_')) return false;
  return true;
};

// Create optimized nodemailer transport
export function buildTransporter() {
  const isGmail = env.SMTP_SERVICE === 'gmail' || env.SMTP_HOST.includes('gmail');

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: isSmtpConfigured()
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS.replace(/\s+/g, ''), // Remove spaces if user copied Google App Password as "xxxx xxxx xxxx xxxx"
          }
        : undefined,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE || env.SMTP_PORT === 465,
    auth: isSmtpConfigured()
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });
}

export const transporter = buildTransporter();

// Helper to verify SMTP connection
export async function verifyMailer(): Promise<{ connected: boolean; message: string }> {
  if (!isSmtpConfigured()) {
    const msg = 'SMTP credentials not configured in server/.env. Emails are simulated and available in the Live Outbox.';
    console.log(`ℹ️  ${msg}`);
    return { connected: false, message: msg };
  }

  try {
    await transporter.verify();
    const msg = `SMTP Mailer connected successfully to ${env.SMTP_HOST || env.SMTP_SERVICE} (${env.SMTP_USER})`;
    console.log(`✅ ${msg}`);
    return { connected: true, message: msg };
  } catch (error) {
    const errMsg = (error as Error).message;
    console.warn(`⚠️ Mailer connection warning: ${errMsg}`);
    return { connected: false, message: errMsg };
  }
}
