import { Router } from 'express';
import {  registerStaff, getAllUsers, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

// 1. Admin mendaftarkan staff baru (Sesuai soal: Admin bisa semua)
router.post('/register', verifyToken, verifyAdmin, registerStaff);

// 2. Admin melihat semua daftar user (User Management)
router.get('/', verifyToken, verifyAdmin, getAllUsers);

// 3. User melihat profilnya sendiri atau Admin melihat profil siapapun
router.get('/:id', verifyToken, getUserProfile);

// 4. User mengupdate alamat/nomor telp (Sesuai soal: Profile management)
// Admin juga bisa mengedit profil siapapun lewat sini
router.put('/:id', verifyToken, updateUserProfile);

export default router;