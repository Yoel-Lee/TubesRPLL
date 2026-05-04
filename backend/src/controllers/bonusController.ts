import type { Request, Response } from "express";
import prisma from "../db.js";

export const createBonus = async (req: Request, res: Response) => {
  try {
    const { userId, amount, notes } = req.body;

    const bonus = await prisma.bonus.create({
      data: {
        userId: Number(userId),
        amount: parseFloat(amount),
        notes
      }
    });

    res.status(201).json(bonus);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBonusByUser = async (req: Request, res: Response) => {
  try {
    const { userId, month, year } = req.query;

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0);

    const bonus = await prisma.bonus.findMany({
      where: {
        userId: Number(userId),
        createdAt: {
          gte: start,
          lte: end
        }
      }
    });

    res.json(bonus);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};