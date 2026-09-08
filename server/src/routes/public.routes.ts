import { Router, Request, Response } from 'express';
import prisma from '../config/db';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { MailService } from '../services/mail.service';
import { generateApplicationReceivedEmail } from '../services/emailTemplates';

const router = Router();

// Public: Get all published job postings
router.get('/jobs', async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        department: true,
        location: true,
        employmentType: true,
        description: true,
        formFields: true,
        pipelineStages: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    sendSuccess(res, jobs, 'Published jobs retrieved');
  } catch (error) {
    sendError(res, (error as Error).message, 500);
  }
});

// Public: Get single job details with dynamic form configuration
router.get('/jobs/:slugOrId', async (req: Request, res: Response): Promise<void> => {
  try {
    const slugOrId = String(req.params.slugOrId);
    const job = await prisma.job.findFirst({
      where: {
        OR: [{ id: slugOrId }, { slug: slugOrId }],
        status: 'PUBLISHED',
      },
    });

    if (!job) {
      sendError(res, 'Job posting not found or no longer active', 404);
      return;
    }

    sendSuccess(res, job, 'Job details retrieved');
  } catch (error) {
    sendError(res, (error as Error).message, 500);
  }
});

// Public: Submit candidate application for a specific job
router.post('/jobs/:jobId/apply', async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = String(req.params.jobId);
    const { name, email, phone, applicantData } = req.body;

    if (!name || !email) {
      sendError(res, 'Name and email are required to submit an application', 400);
      return;
    }

    // Verify job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== 'PUBLISHED') {
      sendError(res, 'This job position is not accepting applications', 400);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Prevent duplicate applications for the same job
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        jobId: job.id,
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    });

    if (existingCandidate) {
      sendError(
        res,
        'هذا البريد الإلكتروني مسجل بالفعل في طلب تقديم مسبق لهذه الوظيفة. لا يمكن التقديم أكثر من مرة لنفس الوظيفة.',
        400
      );
      return;
    }

    // Extract first stage from job's pipelineStages or default to "applied"
    const stages = (job.pipelineStages as any[]) || [];
    const firstStageId = stages.length > 0 ? stages[0].id : 'applied';

    const candidate = await prisma.candidate.create({
      data: {
        jobId: job.id,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        applicantData: applicantData || {},
        currentStage: firstStageId,
        status: 'PENDING',
      },
    });

    // Send instant confirmation email to applicant
    if (candidate.email) {
      const firstStageName = stages.length > 0 ? stages[0].name : 'المراجعة الأولية وتدقيق السيرة الذاتية';
      const emailHtml = generateApplicationReceivedEmail({
        candidateName: candidate.name,
        jobTitle: job.title,
        stages: stages,
        currentStageName: firstStageName,
      });

      try {
        await MailService.sendEmail({
          to: candidate.email,
          subject: `Application Received: ${job.title} — Hire ATS`,
          html: emailHtml,
          type: 'APPLICATION_RECEIVED',
        });
      } catch (err) {
        console.warn(`ℹ️ Application confirmation email warning: ${(err as Error).message}`);
      }
    }

    sendSuccess(res, candidate, 'Application submitted successfully! We will review your profile.', 201);
  } catch (error) {
    sendError(res, (error as Error).message, 500);
  }
});

export default router;
