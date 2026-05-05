import { Router } from 'express';
import { clockInOut, getHistory } from '../controllers/attendanceController.js';
import { verifyToken } from '../middleware/auth.js';
import { updateAttendance } from '../controllers/attendanceController.js';

const router = Router();
router.post('/', verifyToken, clockInOut);
router.get('/', verifyToken, getHistory);
router.patch('/:id', updateAttendance);
export default router;