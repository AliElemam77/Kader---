import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { optionalAuth } from '../middlewares/authMiddleware';

const router = Router();

// Support authenticated recruiters or internal workspace requests
router.use(optionalAuth);

router.get('/', CandidateController.listCandidates);
router.patch('/:id/stage', CandidateController.updateStage);
router.post('/:id/reject', CandidateController.rejectCandidate);
router.post('/:id/unreject', CandidateController.unrejectCandidate);
router.delete('/:id', CandidateController.deleteCandidate);

export default router;
