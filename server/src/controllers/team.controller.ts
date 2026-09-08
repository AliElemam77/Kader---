import { Response } from 'express';
import { TeamService } from '../services/team.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types/auth.types';

export class TeamController {
  // List team members
  static async listTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const members = await TeamService.listTeam();
      sendSuccess(res, members, 'Team members retrieved');
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }

  // Invite new member
  static async inviteMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, email, role } = req.body;
      if (!name || !email) {
        sendError(res, 'Name and email are required to invite a team member', 400);
        return;
      }

      const result = await TeamService.inviteMember({
        name,
        email,
        role: role || 'RECRUITER',
      });

      sendSuccess(res, result, `Invitation sent to ${email}`, 201);
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Update member (name, role, status)
  static async updateMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { name, email, role, status } = req.body;

      const updated = await TeamService.updateMember(id, { name, email, role, status });
      sendSuccess(res, updated, 'Member updated successfully');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Delete member
  static async deleteMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const currentAdminId = req.user?.id;

      await TeamService.deleteMember(id, currentAdminId);
      sendSuccess(res, null, 'Team member deleted successfully');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }
}
