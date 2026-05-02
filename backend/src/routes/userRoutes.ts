import { Router } from 'express';
import {  registerStaff, getAllUsers, getUserProfile, updateUserProfile, updateMyProfile } from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();


router.put('/updateme',verifyToken, updateMyProfile);

// 1. Admin mendaftarkan staff baru 
router.post('/register', verifyToken, verifyAdmin, registerStaff);
// 2. Admin melihat semua daftar user (User Management)
router.get('/', verifyToken, verifyAdmin, getAllUsers);


// 3. User melihat profilnya sendiri atau Admin melihat profil siapapun
router.get('/:id', verifyToken, getUserProfile);

// 4. User mengupdate alamat/nomor telp (Sesuai soal: Profile management)
// Admin juga bisa mengedit profil siapapun lewat sini
router.put('/:id', verifyToken, updateUserProfile);

router.post('/register', registerStaff);


export default router;