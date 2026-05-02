import { Router } from 'express';
import { login, forgotPassword, resetPassword , initAdmin} from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword); 
router.post('/init-admin', initAdmin);

export default router;