import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class JobController {
  // List all jobs
  static async listJobs(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await JobService.listJobs();
      sendSuccess(res, jobs, 'Jobs retrieved');
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }

  // Create a new job posting
  static async createJob(req: Request, res: Response): Promise<void> {
    try {
      const { title, department, location, employmentType, description, status } = req.body;

      if (!title || !description) {
        sendError(res, 'Title and description are required to create a job position', 400);
        return;
      }

      const created = await JobService.createJob({
        title,
        department,
        location,
        employmentType,
        description,
        status,
      });

      sendSuccess(res, created, 'Job position created successfully and saved to PostgreSQL', 201);
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Add custom stage to job
  static async addCustomStage(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const stage = req.body;

      if (!stage || !stage.name) {
        sendError(res, 'Stage name is required', 400);
        return;
      }

      const updated = await JobService.addCustomStage(id, stage);
      sendSuccess(res, updated, 'Custom stage added and saved to PostgreSQL');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Update pipeline stages
  static async updateStages(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { stages } = req.body;

      if (!Array.isArray(stages)) {
        sendError(res, 'Stages must be an array', 400);
        return;
      }

      const updated = await JobService.updatePipelineStages(id, stages);
      sendSuccess(res, updated, 'Pipeline stages updated');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Update form fields
  static async updateFormFields(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { formFields } = req.body;

      if (!Array.isArray(formFields)) {
        sendError(res, 'formFields must be an array', 400);
        return;
      }

      const updated = await JobService.updateFormFields(id, formFields);
      sendSuccess(res, updated, 'Form fields updated and persisted to PostgreSQL');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Delete stage from pipeline and migrate candidates
  static async deleteStage(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const stageId = String(req.params.stageId);

      const updated = await JobService.deleteStage(id, stageId);
      sendSuccess(res, updated, 'Stage deleted successfully and candidates relocated to fallback stage');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Delete job position
  static async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await JobService.deleteJob(id);
      sendSuccess(res, null, 'Job position and related records deleted successfully');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }
}
