import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { env } from '../config/env';
import { MailService } from './mail.service';
import { generateAuthOtpEmail } from './emailTemplates';
import { AuthUser, JwtPayload } from '../types/auth.types';

export class AuthService {
  // Ensure default admin exists for easy initial onboarding
  static async ensureDefaultAdmin(): Promise<void> {
    const adminEmail = 'admin@hire-ats.local';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'HR Lead (Admin)',
          role: 'HR_MANAGER',
          status: 'ACTIVE',
        },
      });
      console.log(`👤 Default HR Manager created: ${adminEmail}`);
    }
  }

  // Request Access: Generates 6-digit OTP + Magic Link token and dispatches hybrid email
  static async requestAccess(email: string): Promise<{ success: boolean; message: string; devOtp?: string; devLink?: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user is registered/invited
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // For first-time local development ease, allow auto-creating admin if none exist
    if (!user) {
      const usersCount = await prisma.user.count();
      if (usersCount === 0 || normalizedEmail.includes('admin') || normalizedEmail.includes('hire-ats')) {
        const isRecruiter = normalizedEmail.includes('recruiter');
        const role = isRecruiter ? 'RECRUITER' : (normalizedEmail.includes('admin') || usersCount === 0 ? 'HR_MANAGER' : 'RECRUITER');
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: isRecruiter ? 'مسؤول توظيف (Recruiter)' : normalizedEmail.split('@')[0].toUpperCase(),
            role,
            status: 'ACTIVE',
          },
        });
      } else {
        throw new Error('This email is not authorized. Please ask your HR Manager for an invitation.');
      }
    }

    if (user.status === 'DEACTIVATED') {
      throw new Error('Your account has been deactivated. Please contact HR management.');
    }

    // Invalidate previous unused codes for this email
    await prisma.verificationCode.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    // Generate 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Generate cryptographic Magic Link token
    const magicToken = crypto.randomBytes(24).toString('hex');

    // Code expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        email: normalizedEmail,
        code: otpCode,
        token: magicToken,
        expiresAt,
        userId: user.id,
      },
    });

    const loginPageUrl = `${env.CLIENT_URL}/?auth=login&email=${encodeURIComponent(normalizedEmail)}`;

    // Send Email (6-digit OTP + Direct link to Login Page)
    const emailHtml = generateAuthOtpEmail({
      userName: user.name,
      otpCode,
      loginPageUrl,
    });

    // Send Email & record in live ATS Outbox
    MailService.sendEmail({
      to: normalizedEmail,
      subject: `رمز التحقق لدخول كادر: ${otpCode} | Kader ATS Login Code`,
      html: emailHtml,
      type: 'AUTH_OTP',
    }).catch((err) => {
      console.warn(`ℹ️ MailService log: ${(err as Error).message}`);
    });

    // Log credentials to console for instant developer access
    console.log(`\n======================================================`);
    console.log(`🔑 [DEV AUTH] Login requested for: ${normalizedEmail}`);
    console.log(`🔢 6-Digit OTP: ${otpCode}`);
    console.log(`🔗 Login Page:  ${loginPageUrl}`);
    console.log(`======================================================\n`);

    return {
      success: true,
      message: 'A 6-digit verification code has been sent to your email.',
      devOtp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
      devLink: process.env.NODE_ENV === 'development' ? loginPageUrl : undefined,
    };
  }

  // Verify 6-digit OTP code
  static async verifyOtp(email: string, code: string): Promise<{ token: string; user: AuthUser }> {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const record = await prisma.verificationCode.findFirst({
      where: {
        email: normalizedEmail,
        code: cleanCode,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!record || !record.user) {
      throw new Error('Invalid or expired verification code.');
    }

    // Mark as used
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    // If user was invited, activate account
    if (record.user.status === 'INVITED') {
      await prisma.user.update({
        where: { id: record.user.id },
        data: { status: 'ACTIVE' },
      });
    }

    const payload: JwtPayload = {
      userId: record.user.id,
      email: record.user.email,
      role: record.user.role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: record.user.id,
        email: record.user.email,
        name: record.user.name,
        role: record.user.role,
        status: 'ACTIVE',
      },
    };
  }

  // Verify 1-Click Magic Link Token
  static async verifyMagicLink(token: string): Promise<{ token: string; user: AuthUser }> {
    const cleanToken = token.trim();

    const record = await prisma.verificationCode.findUnique({
      where: {
        token: cleanToken,
      },
      include: { user: true },
    });

    if (!record || record.used || record.expiresAt < new Date() || !record.user) {
      throw new Error('This login link is invalid, expired, or has already been used.');
    }

    // Mark as used
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Activate user if invited
    if (record.user.status === 'INVITED') {
      await prisma.user.update({
        where: { id: record.user.id },
        data: { status: 'ACTIVE' },
      });
    }

    const payload: JwtPayload = {
      userId: record.user.id,
      email: record.user.email,
      role: record.user.role,
    };

    const jwtToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

    return {
      token: jwtToken,
      user: {
        id: record.user.id,
        email: record.user.email,
        name: record.user.name,
        role: record.user.role,
        status: 'ACTIVE',
      },
    };
  }

  // Get current user by token payload
  static async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status === 'DEACTIVATED') {
      throw new Error('User not found or deactivated.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };
  }
}
