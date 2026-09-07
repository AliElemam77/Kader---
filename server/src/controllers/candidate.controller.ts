import { Request, Response } from 'express';
import { CandidateService } from '../services/candidate.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class CandidateController {
  // Get all candidates
  static async listCandidates(req: Request, res: Response): Promise<void> {
    try {
      const jobId = req.query.jobId ? String(req.query.jobId) : undefined;
      const candidates = await CandidateService.listCandidates(jobId);
      sendSuccess(res, candidates, 'Candidates retrieved from database');
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }

  // Update candidate stage and schedule
  static async updateStage(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { currentStage, status, scheduledInterview, stageTask, stageNotes } = req.body;

      if (!currentStage) {
        sendError(res, 'currentStage is required', 400);
        return;
      }

      const updated = await CandidateService.updateCandidateStage(id, {
        currentStage,
        status,
        scheduledInterview,
        stageTask,
        stageNotes,
      });

      sendSuccess(res, updated, 'Candidate stage updated and persisted to database');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Reject candidate with respectful reason and feedback
  static async rejectCandidate(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { rejectionReason, sendEmail } = req.body;

      if (!rejectionReason || !rejectionReason.trim()) {
        sendError(res, 'Rejection reason is required out of respect for the applicant', 400);
        return;
      }

      const updated = await CandidateService.rejectCandidate(
        id,
        rejectionReason,
        sendEmail !== false
      );

      sendSuccess(res, updated, 'Candidate rejected with respectful feedback recorded and sent');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Restore rejected candidate
  static async unrejectCandidate(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await CandidateService.unrejectCandidate(id);
      sendSuccess(res, updated, 'Candidate rejection revoked and restored to active pipeline');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Permanently delete a candidate from database
  static async deleteCandidate(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await CandidateService.deleteCandidate(id);
      sendSuccess(res, { id }, 'Candidate deleted permanently from database');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }
}
