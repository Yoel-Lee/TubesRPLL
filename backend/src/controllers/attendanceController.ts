import { type Response } from 'express';
import prisma from '../db.js';
import { type AuthRequest } from '../middleware/auth.js';

export const clockInOut = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { type } = req.body;
    const userId = req.user!.id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // cek apakah user X udah absen belom
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        type: type,
        time: {
          gte: todayStart,
          lte: todayEnd,
        }
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: `Akses ditolak. Anda sudah melakukan absen ${type} hari ini!` });
    }

    const attendance = await prisma.attendance.create({
      data: { userId, type }
    });
    
    res.status(201).json({ message: `Absen ${type} berhasil!`, data: attendance });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};


export const getHistory = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    let where = {};

    if (req.user?.role !== 'ADMIN') {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      where = { userId: req.user.id };
    }

    const data = await prisma.attendance.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: { time: 'desc' }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const updateAttendance = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { time, type } = req.body;

    const updated = await prisma.attendance.update({
      where: { id: Number(id) },
      data: {
        time: new Date(time),
        type: type
      }
    });

    res.json({ message: "Absen berhasil dikoreksi", updated });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengupdate absen" });
  }
};