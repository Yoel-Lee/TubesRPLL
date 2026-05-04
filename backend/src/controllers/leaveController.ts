import { type Response } from 'express';
import prisma from '../db.js';
import { type AuthRequest } from '../middleware/auth.js';

// 1. Staff mengajukan cuti
export const requestLeave = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.user!.id;

    const newLeave = await prisma.leave.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        userId,
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: 'Pengajuan cuti berhasil dikirim', data: newLeave });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 2. Mendapatkan daftar cuti (Admin lihat semua, Staff lihat punya sendiri)
export const getLeaves = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = req.user;
    
    // Jika Admin, tarik semua data beserta nama pegawainya
    if (user?.role === 'ADMIN') {
      const allLeaves = await prisma.leave.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { startDate: 'desc' }
      });
      return res.json(allLeaves);
    }

    // Jika Staff, tarik cuti miliknya sendiri
    const myLeaves = await prisma.leave.findMany({
        where: { userId: user!.id },
      orderBy: { startDate: 'desc' }
    });
    res.json(myLeaves);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 3. Update Status Cuti (Hanya Admin atau Manajer yang bersangkutan)
export const updateLeaveStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED atau REJECTED

    // Update status
    const updatedLeave = await prisma.leave.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json({ message: `Status cuti berhasil diupdate menjadi ${status}`, data: updatedLeave });
  } catch (error) {
    res.status(500).json({ message: 'Gagal update status cuti', error: String(error) });
  }
};

// 4. Endpoint khusus Kalender: Semua user bisa lihat, tapi HANYA yang APPROVED
export const getApprovedLeavesForCalendar = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const approvedLeaves = await prisma.leave.findMany({
      where: { status: 'APPROVED' },
      include: { 
        user: { select: { name: true } } // Hanya ambil nama saja untuk privasi
      }
    });
    res.json(approvedLeaves);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};