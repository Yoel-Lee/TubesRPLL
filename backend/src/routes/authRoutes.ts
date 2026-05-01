import { Router } from 'express';
import { login, initAdmin } from '../controllers/authController.js';

const router = Router();
router.post('/init-admin', initAdmin);
router.post('/login', login);
export default router;