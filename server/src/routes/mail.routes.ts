import { Router } from 'express';
import { MailController } from '../controllers/mail.controller';

const router = Router();

router.get('/outbox', MailController.getOutbox);
router.delete('/outbox', MailController.clearOutbox);
router.get('/status', MailController.checkStatus);
router.post('/test', MailController.testEmail);

export default router;
