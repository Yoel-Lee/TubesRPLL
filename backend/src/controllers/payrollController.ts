import { type Response } from 'express';
import prisma from '../db.js';
import { type AuthRequest } from '../middleware/auth.js';

export const calculatePayroll = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { userId, month, year } = req.body;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // 1. Hitung INSENTIF (Reimburse Approved)
    const approvedReimbursements = await prisma.reimbursement.findMany({
      where: {
        userId: Number(userId),
        status: 'APPROVED',
        date: { gte: startDate, lt: endDate }
      }
    });
    const totalIncentive = approvedReimbursements.reduce((sum: number, item: any) => sum + item.amount, 0);

    // 2. Hitung PENALTI TELAT (Auto-detect dari Attendance)
    const attendances = await prisma.attendance.findMany({
      where: {
        userId: Number(userId),
        type: 'IN',
        time: { gte: startDate, lt: endDate }
      }
    });

    const bonuses = await prisma.bonus.findMany({
      where: {
        userId: Number(userId),
        createdAt: { gte: startDate, lt: endDate }
      }
    });

    const totalBonus = bonuses.reduce((sum, item) => sum + item.amount, 0);

    const dendas = await prisma.denda.findMany({
      where: {
        userId: Number(userId),
        createdAt: { gte: startDate, lt: endDate }
      }
    });

    const totalDenda = dendas.reduce((sum: number, item: any) => sum + item.amount, 0);

    let latePenalty = 0;
    const LATE_THRESHOLD_HOUR = 9; // Batas jam 9 pagi
    const PENALTY_PER_LATE = 50000;

    attendances.forEach((record: any) => {
      const clockInHour = new Date(record.time).getHours();
      const clockInMinute = new Date(record.time).getMinutes();

      // Jika jam > 9 ATAU (jam == 9 dan menit > 0)
      if (clockInHour > LATE_THRESHOLD_HOUR || (clockInHour === LATE_THRESHOLD_HOUR && clockInMinute > 0)) {
        latePenalty += PENALTY_PER_LATE;
      }
    });

    // 3. Kalkulasi Akhir
    const netSalary = user.baseSalary + totalIncentive + totalBonus - latePenalty - totalDenda;

    res.json({
      employee: user.name,
      month,
      year,
      details: {
        baseSalary: user.baseSalary,
        totalReimburse: totalIncentive,
        totalPenalty: latePenalty + totalDenda,
        totalLatePenalty: latePenalty,
        totalLateRecords: latePenalty / PENALTY_PER_LATE,
        totalBonus: totalBonus,
        totalDenda: totalDenda,
        grandTotal: netSalary
      }
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};