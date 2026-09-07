import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { optionalAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(optionalAuth);

router.get('/', JobController.listJobs);
router.post('/', JobController.createJob);
router.post('/:id/stages', JobController.addCustomStage);
router.put('/:id/stages', JobController.updateStages);
router.delete('/:id/stages/:stageId', JobController.deleteStage);
router.put('/:id/form-fields', JobController.updateFormFields);
router.delete('/:id', JobController.deleteJob);

export default router;
