import prisma from '../config/db';
import { CandidateStatus } from '@prisma/client';
import { env } from '../config/env';
import { MailService } from './mail.service';
import {
  generateStageTransitionEmail,
  generateHiredEmail,
  generateRejectionEmail,
} from './emailTemplates';

export interface StageTaskDto {
  title?: string;
  description?: string;
  taskUrl?: string;
  deadline?: string;
}

export interface UpdateStageDto {
  currentStage: string;
  status?: CandidateStatus;
  scheduledInterview?: {
    date: string;
    dayOfWeek: string;
    time: string;
    durationMinutes: number;
    modality: 'ONLINE' | 'OFFLINE';
    locationOrLink: string;
    interviewerName: string;
    notes?: string;
  };
  stageTask?: StageTaskDto;
  stageNotes?: string;
}

export class CandidateService {
  // Get all candidates (optionally filtered by job)
  static async listCandidates(jobId?: string) {
    const candidates = await prisma.candidate.findMany({
      where: jobId ? { jobId } : undefined,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            pipelineStages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return candidates.map((c) => {
      const applicantData = (c.applicantData as Record<string, any>) || {};
      return {
        ...c,
        scheduledInterview: applicantData.scheduledInterview || undefined,
        stageTask: applicantData.stageTask || undefined,
        stageNotes: applicantData.stageNotes || undefined,
      };
    });
  }

  // Update candidate stage & persist scheduled interview in PostgreSQL
  static async updateCandidateStage(id: string, dto: UpdateStageDto) {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!candidate) {
      throw new Error('Candidate not found.');
    }

    const currentApplicantData = (candidate.applicantData as Record<string, any>) || {};
    const updatedApplicantData = {
      ...currentApplicantData,
      ...(dto.scheduledInterview ? { scheduledInterview: dto.scheduledInterview } : {}),
      ...(dto.stageTask ? { stageTask: dto.stageTask } : {}),
      ...(dto.stageNotes !== undefined ? { stageNotes: dto.stageNotes } : {}),
    };

    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        currentStage: dto.currentStage,
        status: dto.status || candidate.status,
        applicantData: updatedApplicantData as any,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            pipelineStages: true,
          },
        },
      },
    });

    // Send Stage Transition Notification Email via Nodemailer if applicable
    if (candidate.email) {
      const stages = (updated.job?.pipelineStages as any[]) || [];
      const stageObj = stages.find((s) => s.id === dto.currentStage);
      const isHired =
        dto.status === 'HIRED' ||
        (stageObj && (stageObj.name.toLowerCase().includes('hired') || stageObj.name.includes('قبول')));

      if (isHired) {
        const emailHtml = generateHiredEmail({
          candidateName: candidate.name,
          jobTitle: updated.job.title,
        });

        MailService.sendEmail({
          to: candidate.email,
          subject: `Congratulations! Offer of Employment for ${updated.job.title} 🎉`,
          html: emailHtml,
          type: 'STAGE_UPDATE',
        }).catch((err) => {
          console.warn(`ℹ️ Candidate hired email log: ${(err as Error).message}`);
        });
      } else if (stageObj) {
        const interview = dto.scheduledInterview;
        const emailHtml = generateStageTransitionEmail({
          candidateName: candidate.name,
          jobTitle: updated.job.title,
          stageName: stageObj.name,
          scheduledInterview: interview,
          stageTask: dto.stageTask,
          stageNotes: dto.stageNotes,
        });

        MailService.sendEmail({
          to: candidate.email,
          subject: interview
            ? `Interview Scheduled: ${updated.job.title} (${stageObj.name})`
            : `Application Update: ${stageObj.name} — ${updated.job.title}`,
          html: emailHtml,
          type: interview ? 'INTERVIEW_INVITATION' : 'STAGE_UPDATE',
        }).catch((err) => {
          console.warn(`ℹ️ Candidate notification log: ${(err as Error).message}`);
        });
      }
    }

    return {
      ...updated,
      scheduledInterview: updatedApplicantData.scheduledInterview || undefined,
      stageTask: updatedApplicantData.stageTask || undefined,
      stageNotes: updatedApplicantData.stageNotes || undefined,
    };
  }

  // Reject candidate with a respectful constructive feedback reason
  static async rejectCandidate(id: string, rejectionReason: string, sendEmail: boolean = true) {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!candidate) {
      throw new Error('Candidate not found.');
    }

    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
      },
      include: { job: true },
    });

    // Send a polite and respectful rejection email with the constructive reason
    if (sendEmail && candidate.email) {
      const jobTitle = candidate.job?.title || 'the position';
      const emailHtml = generateRejectionEmail({
        candidateName: candidate.name,
        jobTitle,
        rejectionReason,
      });

      MailService.sendEmail({
        to: candidate.email,
        subject: `Update regarding your application for ${jobTitle}`,
        html: emailHtml,
        type: 'STAGE_UPDATE',
      }).catch((err) => {
        console.warn(`ℹ️ Candidate rejection email log: ${(err as Error).message}`);
      });
    }

    const applicantData = (updated.applicantData as Record<string, any>) || {};
    return {
      ...updated,
      scheduledInterview: applicantData.scheduledInterview || undefined,
    };
  }

  // Restore / Unreject candidate back to active pipeline
  static async unrejectCandidate(id: string) {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!candidate) {
      throw new Error('Candidate not found.');
    }

    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        rejectionReason: null,
      },
      include: { job: true },
    });

    const applicantData = (updated.applicantData as Record<string, any>) || {};
    return {
      ...updated,
      scheduledInterview: applicantData.scheduledInterview || undefined,
      stageTask: applicantData.stageTask || undefined,
      stageNotes: applicantData.stageNotes || undefined,
    };
  }

  // Delete candidate from PostgreSQL database
  static async deleteCandidate(id: string) {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new Error('Candidate not found.');
    }

    return prisma.candidate.delete({
      where: { id },
    });
  }
}
