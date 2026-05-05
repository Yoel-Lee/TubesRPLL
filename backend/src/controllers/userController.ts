import {type Request, type Response } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcrypt';
import { type AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../utils/activityHelper.js';

// 1. Register Staff (Oleh Admin) - VERSI UPDATE
export const registerStaff = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { name, email, password, role, managerId, baseSalary, phoneNumber, address } = req.body;
    
    // Validasi domain email (tambahan proteksi di backend)
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ error: "Hanya email @gmail.com yang diperbolehkan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        role, 
        managerId: managerId ? Number(managerId) : null,
        baseSalary: Number(baseSalary) || 0, 
        phoneNumber, 
        address     
      }
    });

    // 👇 TAMBAHKAN LOG ACTIVITY DI SINI 👇
    // Kita asumsikan req.user.id adalah ID Admin yang sedang login
    if (req.user) {
      await logActivity(
        req.user.id, 
        "REGISTER_STAFF", 
        `Mendaftarkan staff baru bernama ${newUser.name} dengan role ${newUser.role}`
      );
    }

    res.status(201).json({ message: "Staff berhasil dibuat", data: newUser });
  } catch (error: any) {
    // Cek jika email duplikat
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Email sudah terdaftar." });
    }
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
    const actorId = req.user!.id; // Orang yang melakukan klik "Save"
    
    // 1. Logika Proteksi: Cek akses
    if (req.user?.role !== 'ADMIN' && req.user?.id !== userIdToUpdate) {
      return res.status(403).json({ message: "Anda tidak punya akses mengedit user ini" });
    }

    // 2. Filter Data: Pisahkan mana yang boleh diedit User vs Admin
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
      data: updateData 
    });

    // 👇 TAMBAHKAN LOG ACTIVITY DI SINI 👇
    const detailPesan = req.user?.role === 'ADMIN' 
      ? `Admin mengubah data profil/gaji milik staff: ${updatedUser.name}`
      : `Staff memperbarui data profilnya sendiri`;

    await logActivity(actorId, "UPDATE_USER_PROFILE", detailPesan);

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

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<any> => {
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

    await logActivity(
      userId, 
      "UPDATE_PERSONAL_PROFILE", 
      `Memperbarui data profil pribadi (Nama/No.Telp/Alamat)`
    );

    res.json(updatedUser);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};