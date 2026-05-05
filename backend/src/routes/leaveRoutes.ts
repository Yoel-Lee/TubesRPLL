import { Router } from 'express';
import { requestLeave, getLeaves, updateLeaveStatus, getApprovedLeavesForCalendar } from '../controllers/leaveController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, requestLeave);
router.get('/', verifyToken, getLeaves);
router.get('/calendar', verifyToken, getApprovedLeavesForCalendar);
router.patch('/:id', verifyToken, verifyAdmin, updateLeaveStatus); 
export default router;