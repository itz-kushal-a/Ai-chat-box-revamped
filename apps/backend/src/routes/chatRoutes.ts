import { Router } from 'express';
import { chatController } from '../controllers/chatController';

const router = Router();

router.post('/chat', chatController.chat);
router.post('/explain-code', chatController.explainCode);
router.post('/fix-code', chatController.fixCode);
router.post('/generate-code', chatController.generateCode);

export default router;
