import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// All team management routes are strictly restricted to HR_MANAGER
router.use(requireAuth);
router.use(requireRole('HR_MANAGER'));

router.get('/', TeamController.listTeam);
router.post('/invite', TeamController.inviteMember);
router.patch('/:id', TeamController.updateMember);
router.delete('/:id', TeamController.deleteMember);

export default router;
