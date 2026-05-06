import { jest } from '@jest/globals';
import { clockInOut } from '../controllers/attendanceController.js';
import prisma from '../db.js';

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Attendance Controller - Double Clock-In Protection', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fungsi clockInOut', () => {

    it('Sistem HARUS MENOLAK jika user melakukan absen "IN" 2 kali di hari yang sama', async () => {
      const mockExistingData = {
        id: 1,
        userId: 5,
        type: 'IN',
        time: new Date()
      };

      jest.spyOn(prisma.attendance, 'findFirst').mockResolvedValue(mockExistingData as any);

      const req: any = {
        body: { type: 'IN' },
        user: { id: 5 }
      };
      const res = mockResponse();

      await clockInOut(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Akses ditolak. Anda sudah melakukan absen IN hari ini!' 
      });
    });

    it('Sistem MENGIZINKAN jika user belum pernah absen hari ini', async () => {
      jest.spyOn(prisma.attendance, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.attendance, 'create').mockResolvedValue({ id: 2, userId: 5, type: 'IN' } as any);

      const req: any = {
        body: { type: 'IN' },
        user: { id: 5 }
      };
      const res = mockResponse();

      await clockInOut(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Absen IN berhasil!' })
      );
    });

  });
});