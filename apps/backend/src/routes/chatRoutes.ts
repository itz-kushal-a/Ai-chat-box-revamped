import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/history', chatController.getChatHistory);
router.get('/:id', chatController.getChatMessages);
router.post('/chat', chatController.chat);
router.post('/chat-stream', chatController.streamChat);
router.post('/explain-code', chatController.explainCode);
router.post('/fix-code', chatController.fixCode);
router.post('/generate-code', chatController.generateCode);

export default router;
