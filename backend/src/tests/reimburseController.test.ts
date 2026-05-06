import { jest } from '@jest/globals';
import { requestReimburse } from '../controllers/reimburseController.js';
import prisma from '../db.js';

// Alat bantu (Mock Response)
const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Reimburse Controller - Unit Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fungsi requestReimburse', () => {

    it('Harus membuat notifikasi untuk SELURUH ADMIN saat ada pengajuan baru', async () => {
      const mockSender = { id: 5, name: 'Budi' };
      const mockAdmins = [
        { id: 1, role: 'ADMIN' },
        { id: 2, role: 'ADMIN' }
      ];

      jest.spyOn(prisma.reimbursement, 'create').mockResolvedValue({ id: 100 } as any);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockSender as any);
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockAdmins as any);

      const notificationSpy = jest.spyOn(prisma.notification, 'createMany').mockResolvedValue({ count: 2 } as any);

      const req: any = {
        body: { date: '2026-05-15', description: 'Beli Tinta Printer', amount: 150000 },
        user: { id: 5 }
      };
      const res = mockResponse();

      await requestReimburse(req, res);

      expect(notificationSpy).toHaveBeenCalledTimes(1);

      expect(notificationSpy).toHaveBeenCalledWith({
        data: [
          { 
            userId: 1, 
            title: expect.any(String), 
            message: expect.stringContaining('Budi mengajukan reimburse') 
          },
          { 
            userId: 2, 
            title: expect.any(String), 
            message: expect.stringContaining('Budi mengajukan reimburse') 
          }
        ]
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });

  });
});