import { jest } from '@jest/globals';
import { updateLeaveStatus } from '../controllers/leaveController.js';
import prisma from '../db.js';

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Leave Controller - Security Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fungsi updateLeaveStatus', () => {

    it('MANAGER tidak boleh menyetujui cuti milik staff dari divisi lain (managerId berbeda)', async () => {
      const mockTargetLeave = {
        id: 1,
        status: 'PENDING',
        user: { id: 5, managerId: 99 } 
      };

      jest.spyOn(prisma.leave, 'findUnique').mockResolvedValue(mockTargetLeave as any);

      const req: any = {
        params: { id: '1' },
        body: { status: 'APPROVED', isPaid: true },
        user: { id: 1, role: 'MANAGER' }
      };
      const res = mockResponse();

      await updateLeaveStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Akses ditolak! Anda tidak berhak mengubah status cuti dari staff divisi lain." 
      });
    });

  });
});