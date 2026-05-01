import { Router } from 'express';
import { projectController } from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/tree', projectController.getFileTree);
router.get('/file', projectController.getFileContent);
router.put('/file', projectController.saveFileContent);

export default router;
