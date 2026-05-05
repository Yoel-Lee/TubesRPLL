import prisma from '../db.js';

export const logActivity = async (userId: number, action: string, details: string) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        details
      }
    });
  } catch (error) {
    console.error("Gagal mencatat activity log:", error);
  }
};