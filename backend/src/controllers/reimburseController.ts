import { type Response } from 'express';
import prisma from '../db.js';
import {type AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../utils/activityHelper.js';

// 1. Staff mengajukan Reimbursement
export const requestReimburse = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { date, description, amount } = req.body;
    const userId = req.user!.id;

    // A. Buat data reimbursement
    const newReimburse = await prisma.reimbursement.create({
      data: {
        date: new Date(date),
        description,
        amount: Number(amount),
        userId,
        status: 'PENDING'
      }
    });

    // B. Ambil nama staff untuk isi pesan notifikasi
    const sender = await prisma.user.findUnique({ where: { id: userId } });

    // C. Cari semua user yang jabatannya ADMIN
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    // D. Tembakkan notifikasi ke SEMUA admin
    const notificationData = admins.map(admin => ({
      userId: admin.id,
      title: "Pengajuan Reimburse Baru 💰",
      message: `${sender?.name} mengajukan reimburse sebesar Rp ${amount} untuk: ${description}.`
    }));

    if (notificationData.length > 0) {
      await prisma.notification.createMany({
        data: notificationData
      });
    }

    res.status(201).json({ message: 'Reimbursement berhasil diajukan', data: newReimburse });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 2. Lihat Daftar Reimburse (Admin/Manager lihat semua, Staff lihat sendiri)
export const getReimbursements = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = req.user;
    
    let data;
    if (user?.role === 'ADMIN') {
      data = await prisma.reimbursement.findMany({
        include: { user: { select: { name: true } } },
        orderBy: { date: 'desc' }
      });
    } else {
      data = await prisma.reimbursement.findMany({
        where: { userId: user!.id },
        orderBy: { date: 'desc' }
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 3. Admin Update Status Reimburse (Bonus sekalian kita kasih notif balik ke Staff!)
export const updateReimburseStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED atau REJECTED
    const adminId = req.user!.id; // ID Admin yang sedang login

    const updatedReimburse = await prisma.reimbursement.update({
      where: { id: Number(id) },
      data: { status }
    });

    // 👇 TAMBAHKAN BARIS INI UNTUK MENCATAT LOG 👇
    await logActivity(
      adminId, 
      "UPDATE_REIMBURSE", 
      `Mengubah status reimburse ID #${id} menjadi ${status}`
    );

    // (Kode notifikasi yang sebelumnya kita buat biarkan saja di bawah sini...)
    
    res.json({ message: `Status reimburse diupdate menjadi ${status}`, data: updatedReimburse });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};