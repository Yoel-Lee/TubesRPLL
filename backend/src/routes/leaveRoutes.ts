import { Router } from 'express';
import { requestLeave, getLeaves, updateLeaveStatus, getApprovedLeavesForCalendar } from '../controllers/leaveController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, requestLeave);     // Staff/Admin ajukan cuti
router.get('/', verifyToken, getLeaves);        // Lihat daftar cuti
router.get('/calendar', verifyToken, getApprovedLeavesForCalendar) // Buat liat kalender cuti
router.patch('/:id', verifyToken, verifyAdmin, updateLeaveStatus); // Hanya Admin yang bisa approve/reject

export default router;