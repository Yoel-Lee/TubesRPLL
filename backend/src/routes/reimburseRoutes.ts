import { Router } from 'express';
import { requestReimburse,  getReimbursements,updateReimburseStatus } from '../controllers/reimburseController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, requestReimburse);
router.get('/', verifyToken, getReimbursements);
router.patch('/:id', verifyToken, verifyAdmin, updateReimburseStatus);

export default router;