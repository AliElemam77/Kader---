import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/request-access', AuthController.requestAccess);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/verify-magic-link', AuthController.verifyMagicLink);
router.get('/me', requireAuth, AuthController.getMe);

export default router;
