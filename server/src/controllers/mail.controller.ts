import { Request, Response } from 'express';
import { MailService } from '../services/mail.service';
import { isSmtpConfigured, verifyMailer } from '../config/mailer';
import { env } from '../config/env';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class MailController {
  // Get all outbox emails
  static async getOutbox(req: Request, res: Response): Promise<void> {
    try {
      const outbox = MailService.getOutbox();
      const smtpConfigured = isSmtpConfigured();

      sendSuccess(res, {
        outbox,
        stats: {
          total: outbox.length,
          delivered: outbox.filter((m) => m.status === 'DELIVERED').length,
          simulated: outbox.filter((m) => m.status === 'DEV_SIMULATED').length,
          failed: outbox.filter((m) => m.status === 'FAILED').length,
        },
        smtpConfig: {
          configured: smtpConfigured,
          host: env.SMTP_HOST,
          service: env.SMTP_SERVICE,
          port: env.SMTP_PORT,
          from: env.EMAIL_FROM,
          user: smtpConfigured ? `${env.SMTP_USER.split('@')[0].slice(0, 3)}***@${env.SMTP_USER.split('@')[1] || 'mail'}` : 'Not configured',
        },
      }, 'Outbox retrieved');
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }

  // Clear outbox
  static async clearOutbox(req: Request, res: Response): Promise<void> {
    try {
      MailService.clearOutbox();
      sendSuccess(res, null, 'Outbox cleared');
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }

  // Check SMTP connection status
  static async checkStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await verifyMailer();
      sendSuccess(res, status, 'SMTP status checked');
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }

  // Test send an email to a real address
  static async testEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        sendError(res, 'Valid recipient email address is required', 400);
        return;
      }

      const result = await MailService.testSmtp(email.trim());
      if (result.success) {
        sendSuccess(res, result, result.message);
      } else {
        sendError(res, result.message, 400);
      }
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }
}
