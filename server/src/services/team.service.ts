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

  // Invite a new colleague to the HR Workspace
  static async inviteMember(dto: InviteMemberDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new Error(`A team member with email "${normalizedEmail}" already exists.`);
    }

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: dto.name.trim(),
        role: dto.role || 'RECRUITER',
        status: 'INVITED',
      },
    });

    // Generate onboarding OTP + Magic Link email
    const accessResponse = await AuthService.requestAccess(normalizedEmail);

    return {
      user: newUser,
      invitationDetails: accessResponse,
    };
  }

  // Update team member name, role, or status
  static async updateMember(
    userId: string,
    data: { name?: string; role?: Role; status?: 'ACTIVE' | 'INVITED' | 'DEACTIVATED' }
  ) {
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

  // Delete team member (prevent self-deletion)
  static async deleteMember(userId: string, currentAdminId?: string) {
    if (currentAdminId && userId === currentAdminId) {
      throw new Error('You cannot remove your own administrator account.');
    }

    // Delete associated verification codes first (or cascade)
    await prisma.verificationCode.deleteMany({ where: { userId } });

    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
