import { type Response } from 'express';
import prisma from '../db.js';
import { type AuthRequest } from '../middleware/auth.js';

export const getActivities = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    // Ambil 50 log terbaru agar tidak memberatkan server
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, 
      include: {
        user: {
          select: { name: true, role: true } // Tarik nama dan role pelakunya
        }
      }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};