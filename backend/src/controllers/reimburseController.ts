import { type Response } from 'express';
import prisma from '../db.js';
import {type AuthRequest } from '../middleware/auth.js';

// 1. User Request Reimburse
export const requestReimburse = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { date, description, amount } = req.body;
    const userId = req.user!.id;

    const newReimburse = await prisma.reimbursement.create({
      data: {
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        userId,
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: 'Permintaan reimburse berhasil dikirim', data: newReimburse });
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

// 3. Approve/Reject Reimburse (Oleh Admin/Manager)
export const updateReimburseStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.reimbursement.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json({ message: `Reimburse ${status}`, data: updated });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};