import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// All team routes require authentication
router.use(requireAuth);

// All team members can view the team roster
router.get('/', TeamController.listTeam);

// Only HR_MANAGER can invite or modify team members
router.post('/invite', requireRole('HR_MANAGER'), TeamController.inviteMember);
router.patch('/:id', requireRole('HR_MANAGER'), TeamController.updateMember);
router.delete('/:id', requireRole('HR_MANAGER'), TeamController.deleteMember);

export default router;
