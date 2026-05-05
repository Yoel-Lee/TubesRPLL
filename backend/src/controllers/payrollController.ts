import { type Response } from 'express';
import prisma from '../db.js';
import { type AuthRequest } from '../middleware/auth.js';

// ========================
// HITUNG HARI KERJA
// ========================
const getWorkingDaysBetween = (start: Date, end: Date) => {
  let count = 0;
  const date = new Date(start);

  while (date <= end) {
    const day = date.getDay();
    if (day !== 0 && day !== 6) count++;
    date.setDate(date.getDate() + 1);
  }

  return count;
};

export const calculatePayroll = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { userId, month, year } = req.body;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // ========================
    // 🔥 FIX UTAMA DI SINI
    // ========================
    const baseSalary = Number(user.baseSalary) || 0;

    // ========================
    // 1. REIMBURSE
    // ========================
    const reimbursements = await prisma.reimbursement.findMany({
      where: {
        userId: Number(userId),
        status: 'APPROVED',
        date: { gte: startDate, lt: endDate }
      }
    });

    const totalIncentive = reimbursements.reduce((sum, item) => sum + Number(item.amount), 0);

    // ========================
    // 2. BONUS
    // ========================
    const bonuses = await prisma.bonus.findMany({
      where: {
        userId: Number(userId),
        createdAt: { gte: startDate, lt: endDate }
      }
    });

    const totalBonus = bonuses.reduce((sum, item) => sum + Number(item.amount), 0);

    // ========================
    // 3. DENDA
    // ========================
    const dendas = await prisma.denda.findMany({
      where: {
        userId: Number(userId),
        createdAt: { gte: startDate, lt: endDate }
      }
    });

    const totalDenda = dendas.reduce((sum, item) => sum + Number(item.amount), 0);

    // ========================
    // 4. TELAT
    // ========================
    const attendances = await prisma.attendance.findMany({
      where: {
        userId: Number(userId),
        type: 'IN',
        time: { gte: startDate, lt: endDate }
      }
    });

    let latePenalty = 0;
    const PENALTY_PER_LATE = 50000;

    attendances.forEach((record) => {
      const time = new Date(record.time);
      const hour = time.getHours();
      const minute = time.getMinutes();

      if (hour > 9 || (hour === 9 && minute > 0)) {
        latePenalty += PENALTY_PER_LATE;
      }
    });

    // ========================
    // 5. LEAVE (UNPAID)
    // ========================
    const leaves = await prisma.leave.findMany({
      where: {
        userId: Number(userId),
        status: 'APPROVED',
        startDate: { lt: endDate },
        endDate: { gte: startDate }
      }
    });

    let unpaidLeaveDays = 0;

    leaves.forEach((leave) => {
      if (!leave.isPaid) {
        const start = new Date(
          Math.max(new Date(leave.startDate).getTime(), startDate.getTime())
        );

        const end = new Date(
          Math.min(new Date(leave.endDate).getTime(), endDate.getTime() - 1)
        );

        unpaidLeaveDays += getWorkingDaysBetween(start, end);
      }
    });

    // ========================
    // 🔥 FIX PERHITUNGAN GAJI
    // ========================
    const STANDARD_WORKING_DAYS = 22;

    const salaryPerDay = Math.floor(baseSalary / STANDARD_WORKING_DAYS);

    const unpaidLeaveDeduction = unpaidLeaveDays * salaryPerDay;

    // ========================
    // 7. FINAL
    // ========================
    const netSalary =
      baseSalary +
      totalIncentive +
      totalBonus -
      latePenalty -
      totalDenda -
      unpaidLeaveDeduction;

    res.json({
      employee: user.name,
      month,
      year,
      details: {
        baseSalary: baseSalary,
        totalReimburse: totalIncentive,
        totalBonus: totalBonus,
        totalLatePenalty: latePenalty,
        totalLateRecords: latePenalty / PENALTY_PER_LATE,
        totalDenda: totalDenda,
        unpaidLeaveDays: unpaidLeaveDays,
        unpaidLeaveDeduction: unpaidLeaveDeduction,
        grandTotal: netSalary
      }
    });

  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};