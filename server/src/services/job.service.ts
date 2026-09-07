import prisma from '../config/db';

export class JobService {
  // List all jobs
  static async listJobs() {
    const jobs = await prisma.job.findMany({
      include: {
        _count: {
          select: { candidates: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map((j) => ({
      ...j,
      candidatesCount: j._count.candidates,
    }));
  }

  // Create new job posting with default form and pipeline stages
  static async createJob(data: {
    title: string;
    department?: string;
    location?: string;
    employmentType?: string;
    description: string;
    status?: 'PUBLISHED' | 'DRAFT';
    formFields?: any[];
    pipelineStages?: any[];
    createdById?: string;
  }) {
    let slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) slug = 'job-' + Date.now().toString().slice(-6);

    const existing = await prisma.job.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const defaultStages = [
      { id: 'applied', name: 'Applied / In Review', order: 1, color: '#38bdf8' },
      {
        id: 'screening',
        name: 'HR Screening',
        order: 2,
        color: '#818cf8',
        stageType: 'INTERVIEW',
        defaultModality: 'ONLINE',
        requiresScheduling: true,
      },
      {
        id: 'technical',
        name: 'Technical Assessment',
        order: 3,
        color: '#fbbf24',
        stageType: 'TECHNICAL',
        defaultModality: 'ONLINE',
        requiresScheduling: true,
      },
      { id: 'offer', name: 'Offer & Hired', order: 4, color: '#34d399', stageType: 'OFFER' },
    ];

    const defaultFields = [
      { id: 'full_name', label: 'Full Legal Name', type: 'text', required: true, order: 1 },
      { id: 'email', label: 'Work Email Address', type: 'email', required: true, order: 2 },
      { id: 'phone', label: 'Phone Number', type: 'text', required: false, order: 3 },
      { id: 'years_experience', label: 'Years of Experience', type: 'number', required: true, order: 4 },
      { id: 'resume_cv', label: 'Upload CV / Resume', type: 'file', required: true, order: 5 },
    ];

    const created = await prisma.job.create({
      data: {
        title: data.title.trim(),
        slug,
        department: data.department?.trim() || 'Engineering & Tech',
        location: data.location?.trim() || 'Remote / Riyadh, KSA',
        employmentType: data.employmentType?.trim() || 'Full-time',
        description: data.description.trim(),
        status: data.status || 'PUBLISHED',
        formFields: data.formFields && data.formFields.length > 0 ? data.formFields : defaultFields,
        pipelineStages: data.pipelineStages && data.pipelineStages.length > 0 ? data.pipelineStages : defaultStages,
        createdById: data.createdById || undefined,
      },
      include: {
        _count: {
          select: { candidates: true },
        },
      },
    });

    return {
      ...created,
      candidatesCount: created._count.candidates,
    };
  }

  // Get job by ID or slug
  static async getJobById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        candidates: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Add custom stage to job's pipelineStages in PostgreSQL
  static async addCustomStage(jobId: string, stage: any) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Job not found.');

    const currentStages = (job.pipelineStages as any[]) || [];
    const updatedStages = [...currentStages, stage];

    return prisma.job.update({
      where: { id: jobId },
      data: {
        pipelineStages: updatedStages,
      },
    });
  }

  // Update all pipelineStages in PostgreSQL
  static async updatePipelineStages(jobId: string, stages: any[]) {
    return prisma.job.update({
      where: { id: jobId },
      data: {
        pipelineStages: stages,
      },
    });
  }

  // Delete stage from pipeline and migrate candidates if any
  static async deleteStage(jobId: string, stageId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Job not found.');

    const stages = (job.pipelineStages as any[]) || [];
    if (stages.length <= 1) {
      throw new Error('A job pipeline must have at least one stage.');
    }

    const remainingStages = stages.filter((s) => s.id !== stageId);
    const fallbackStage = remainingStages[0];

    // Migrate any candidate currently in the deleted stage to the fallback stage
    await prisma.candidate.updateMany({
      where: { jobId, currentStage: stageId },
      data: { currentStage: fallbackStage.id },
    });

    return prisma.job.update({
      where: { id: jobId },
      data: { pipelineStages: remainingStages },
    });
  }

  // Update job formFields in PostgreSQL
  static async updateFormFields(jobId: string, formFields: any[]) {
    return prisma.job.update({
      where: { id: jobId },
      data: { formFields },
    });
  }
}
