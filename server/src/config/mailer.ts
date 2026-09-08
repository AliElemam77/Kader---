import nodemailer from 'nodemailer';
import { env } from './env';

export const isSmtpConfigured = (): boolean => {
  if (!env.SMTP_USER || !env.SMTP_PASS) return false;
  if (env.SMTP_USER.includes('your_') || env.SMTP_PASS.includes('your_')) return false;
  return true;
};

// Create optimized nodemailer transport for serverless and production
export function buildTransporter() {
  const cleanPass = (env.SMTP_PASS || '').replace(/["'\s]/g, '');
  const cleanUser = (env.SMTP_USER || '').trim();

  return nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: env.SMTP_PORT ? Number(env.SMTP_PORT) : 465,
    secure: env.SMTP_SECURE || true,
    pool: false, // Critical for serverless: creates a fresh socket and disconnects cleanly
    auth: isSmtpConfigured()
      ? {
          user: cleanUser,
          pass: cleanPass,
        }
      : undefined,
    tls: {
      rejectUnauthorized: false, // Prevent SSL handshake failures in containerized cloud environments
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
}

export const transporter = buildTransporter();

// Helper to verify SMTP connection
export async function verifyMailer(): Promise<{ connected: boolean; message: string }> {
  if (!isSmtpConfigured()) {
    const msg = 'SMTP credentials not configured in environment. Emails are simulated and available in the Live Outbox.';
    console.log(`ℹ️  ${msg}`);
    return { connected: false, message: msg };
  }

  try {
    const activeTransporter = buildTransporter();
    await activeTransporter.verify();
    const msg = `SMTP Mailer connected successfully to ${env.SMTP_HOST || 'smtp.gmail.com'} (${env.SMTP_USER})`;
    console.log(`✅ ${msg}`);
    return { connected: true, message: msg };
  } catch (error) {
    const errMsg = (error as Error).message;
    console.warn(`⚠️ Mailer connection warning: ${errMsg}`);
    return { connected: false, message: errMsg };
  }
}
