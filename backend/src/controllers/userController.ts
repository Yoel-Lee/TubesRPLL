import {type Request, type Response } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcrypt';
import { type AuthRequest } from '../middleware/auth.js';

// 1. Register Staff (Oleh Admin)
export const registerStaff = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { name, email, password, role, managerId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, managerId }
    });
    res.status(201).json({ message: "Staff berhasil dibuat", data: newUser });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 2. Ambil Semua User (Oleh Admin)
export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      include: { manager: { select: { name: true } } } // Supaya kelihatan siapa manajernya
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 3. Lihat Detail Profil
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 4. Update Profil (Alamat, No Telp, Foto - Sesuai Soal)
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, status, role, managerId } = req.body; // Admin bisa ganti ini
    
    // Logika Proteksi: Jika bukan Admin, dia hanya boleh edit dirinya sendiri
    if (req.user?.role !== 'ADMIN' && req.user?.id !== Number(id)) {
      return res.status(403).json({ message: "Anda tidak punya akses mengedit user ini" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: req.body // Mengupdate field yang dikirim dari frontend
    });

    res.json({ message: "Profil berhasil diupdate", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};