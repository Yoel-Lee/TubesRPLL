import { type Response } from 'express';
import prisma from '../db.js';
import { type AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../utils/activityHelper.js';

export const requestLeave = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.user!.id;

    const newLeave = await prisma.leave.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        userId
      }
    });

    await logActivity(
      userId, 
      "REQUEST_LEAVE", 
      `Mengajukan cuti dari tanggal ${startDate} s/d ${endDate} dengan alasan: "${reason}"`
    );

    res.status(201).json({ message: 'Cuti berhasil diajukan', data: newLeave });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const getLeaves = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = req.user;

    if (user?.role === 'ADMIN') {
      const allLeaves = await prisma.leave.findMany({
        include: { user: { select: { name: true, email: true, managerId: true } } },
        orderBy: { startDate: 'desc' }
      });
      return res.json(allLeaves);
    }

    if (user?.role === 'MANAGER') {
      const managerLeaves = await prisma.leave.findMany({
        where: {
          OR: [
            { userId: user.id },
            { user: { managerId: user.id } } 
          ]
        },
        include: { user: { select: { name: true, email: true, managerId: true } } },
        orderBy: { startDate: 'desc' }
      });
      return res.json(managerLeaves);
    }

    const myLeaves = await prisma.leave.findMany({
      where: { userId: user!.id },
      orderBy: { startDate: 'desc' }
    });
    res.json(myLeaves);

  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, isPaid } = req.body; 
    const currentUser = req.user!;

    const targetLeave = await prisma.leave.findUnique({
      where: { id: Number(id) },
      include: { user: true } 
    });

    if (!targetLeave) {
      return res.status(404).json({ message: "Cuti tidak ditemukan" });
    }

    if (currentUser.role === 'MANAGER') {
      if (targetLeave.user.managerId !== currentUser.id) {
         return res.status(403).json({ 
           message: "Akses ditolak! Anda tidak berhak mengubah status cuti dari staff divisi lain." 
         });
      }
    }

    const updatedLeave = await prisma.leave.update({
      where: { id: Number(id) },
      data: { 
        status, 
        isPaid: Boolean(isPaid) 
      }
    });

    let title = "Status Cuti Diperbarui";
    let message = `Pengajuan cuti Anda telah ${status === 'APPROVED' ? 'DISETUJUI' : 'DITOLAK'}.`;
    
    await prisma.notification.create({
      data: {
        userId: updatedLeave.userId,
        title,
        message
      }
    });

    res.json({ message: `Status cuti berhasil diupdate menjadi ${status}`, data: updatedLeave });
  } catch (error) {
    res.status(500).json({ message: 'Gagal update status cuti', error: String(error) });
  }
};

export const getApprovedLeavesForCalendar = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const approvedLeaves = await prisma.leave.findMany({
      where: { status: 'APPROVED' },
      include: { 
        user: { select: { name: true } } 
      }
    });
    res.json(approvedLeaves);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};