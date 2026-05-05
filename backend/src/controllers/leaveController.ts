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
 
    // for admin
    if (user?.role === 'ADMIN') {
      const allLeaves = await prisma.leave.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { startDate: 'desc' }
      });
      return res.json(allLeaves);
    }

    // for staff
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
    const { status, isPaid } = req.body; // APPROVED atau REJECTED

    const updatedLeave = await prisma.leave.update({
      where: { id: Number(id) },
      data: { 
        status, 
        isPaid: Boolean(isPaid) }
    });

    let title = "Status Cuti Diperbarui";
    let message = `Pengajuan cuti Anda telah ${status === 'APPROVED' ? 'DISETUJUI' : 'DITOLAK'} oleh Admin.`;
    
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