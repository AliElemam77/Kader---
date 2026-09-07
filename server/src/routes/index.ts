import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import teamRoutes from './team.routes';
import publicRoutes from './public.routes';
import candidateRoutes from './candidate.routes';
import jobRoutes from './job.routes';
import mailRoutes from './mail.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/team', teamRoutes);
router.use('/public', publicRoutes);
router.use('/candidates', candidateRoutes);
router.use('/jobs', jobRoutes);
router.use('/mail', mailRoutes);

export default router;
