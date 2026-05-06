import { Router } from 'express';
import { registerStaff, getAllUsers, getUserProfile, updateUserProfile, updateMyProfile } from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.put('/updateme', verifyToken, updateMyProfile);
router.get('/', verifyToken, getAllUsers); 
router.get('/:id', verifyToken, getUserProfile);
router.put('/:id', verifyToken, updateUserProfile);
router.post('/register', verifyToken, verifyAdmin, registerStaff);

export default router;