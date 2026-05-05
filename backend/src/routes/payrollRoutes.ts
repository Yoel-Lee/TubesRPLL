import { Router } from 'express';
import { calculatePayroll } from '../controllers/payrollController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/calculate', verifyToken, verifyAdmin, calculatePayroll);

export default router;