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

// 4. Update Profil (Alamat, No Telp, - Sesuai Soal)
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userIdToUpdate = Number(id);
    
    // 1. Logika Proteksi: Cek akses
    if (req.user?.role !== 'ADMIN' && req.user?.id !== userIdToUpdate) {
      return res.status(403).json({ message: "Anda tidak punya akses mengedit user ini" });
    }

    // 2. Filter Data: Pisahkan mana yang boleh diedit User vs Admin
    // Kita ambil semua yang mungkin dikirim dari body
    const { name, phoneNumber, address, status, role, managerId, baseSalary } = req.body;

    let updateData: any = {
      name,
      phoneNumber,
      address,
    };

    // 3. Hanya Admin yang boleh mengubah field sensitif ini
    if (req.user?.role === 'ADMIN') {
      if (status) updateData.status = status;
      if (role) updateData.role = role;
      if (managerId) updateData.managerId = Number(managerId);
      if (baseSalary) updateData.baseSalary = Number(baseSalary);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdToUpdate },
      data: updateData // Gunakan data yang sudah difilter
    });

    res.json({ 
      message: "Profil berhasil diupdate", 
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        role: updatedUser.role
      } 
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal memperbarui profil: " + String(error) });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user?.id);

if (isNaN(userId)) {
  return res.status(400).json({ error: "Invalid user ID" });
}
    const { name, phoneNumber, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      
      data: {
        name,
        phoneNumber,
        address
      }
    });

    res.json(updatedUser);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
