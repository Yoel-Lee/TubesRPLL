import { Router } from 'express';
import { clockInOut, getHistory } from '../controllers/attendanceController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
router.post('/', verifyToken, clockInOut);
router.get('/', verifyToken, getHistory);
export default router;