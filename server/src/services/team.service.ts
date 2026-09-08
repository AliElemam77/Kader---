import prisma from '../config/db';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';

export interface InviteMemberDto {
  name: string;
  email: string;
  role: Role;
}

export class TeamService {
  // List all team members
  static async listTeam() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Invite a new colleague to the HR Workspace (Strict Email Uniqueness)
  static async inviteMember(dto: InviteMemberDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    // Verify email is not already used by another team member
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new Error(`هذا البريد الإلكتروني مسجل بالفعل كعضو في الفريق. A team member with email "${normalizedEmail}" already exists.`);
    }

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: dto.name.trim(),
        role: dto.role || 'RECRUITER',
        status: 'INVITED',
      },
    });

    // Generate onboarding OTP verification code & send invitation email
    const accessResponse = await AuthService.requestAccess(normalizedEmail);

    return {
      user: newUser,
      invitationDetails: accessResponse,
    };
  }

  // Update team member (name, email, role, or status)
  static async updateMember(
    userId: string,
    data: { name?: string; email?: string; role?: Role; status?: 'ACTIVE' | 'INVITED' | 'DEACTIVATED' }
  ) {
    if (data.email) {
      const normalizedEmail = data.email.trim().toLowerCase();
      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existing && existing.id !== userId) {
        throw new Error(`هذا البريد الإلكتروني مسجل بالفعل لعضو آخر في الفريق. Email "${normalizedEmail}" is already in use by another team member.`);
      }
      data.email = normalizedEmail;
    }

    if (data.name) {
      data.name = data.name.trim();
    }

    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  // Delete team member (frees up the email completely so it can be re-invited if needed)
  static async deleteMember(userId: string, currentAdminId?: string) {
    if (currentAdminId && userId === currentAdminId) {
      throw new Error('لا يمكنك حذف حسابك الإداري الخاص. You cannot remove your own administrator account.');
    }

    // Nullify createdById in jobs to prevent foreign key errors
    await prisma.job.updateMany({
      where: { createdById: userId },
      data: { createdById: null },
    });

    // Delete associated verification codes first
    await prisma.verificationCode.deleteMany({ where: { userId } });

    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
