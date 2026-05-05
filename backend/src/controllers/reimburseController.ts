import { type Response } from 'express';
import prisma from '../db.js';
import {type AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../utils/activityHelper.js';

export const requestReimburse = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { date, description, amount } = req.body;
    const userId = req.user!.id;

    const newReimburse = await prisma.reimbursement.create({
      data: {
        date: new Date(date),
        description,
        amount: Number(amount),
        userId,
        status: 'PENDING'
      }
    });

    const sender = await prisma.user.findUnique({ where: { id: userId } });

    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

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

export const updateReimburseStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED atau REJECTED
    const adminId = req.user!.id;

    const updatedReimburse = await prisma.reimbursement.update({
      where: { id: Number(id) },
      data: { status }
    });

    await logActivity(
      adminId, 
      "UPDATE_REIMBURSE", 
      `Mengubah status reimburse ID #${id} menjadi ${status}`
    );
    
    res.json({ message: `Status reimburse diupdate menjadi ${status}`, data: updatedReimburse });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};