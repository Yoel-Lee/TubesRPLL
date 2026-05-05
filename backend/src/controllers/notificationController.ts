import { type Response } from 'express';
import prisma from '../db.js';
import { type AuthRequest } from '../middleware/auth.js';

// Ambil notifikasi milik user yang sedang login
export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Ambil 20 notif terbaru saja agar tidak berat
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// Tandai satu notifikasi sebagai sudah dibaca
export const markAsRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updated = await prisma.notification.update({
      where: { id: Number(id) },
      data: { isRead: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// Tandai SEMUA notifikasi sebagai sudah dibaca
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    res.json({ message: "Semua notifikasi telah dibaca" });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};