import { getWorkingDaysBetween } from '../controllers/payrollController.js';

describe('Payroll Controller - Unit Tests', () => {
  
  describe('Fungsi getWorkingDaysBetween', () => {
    
    it('Harus menghitung 5 hari kerja jika rentang waktu adalah Senin sampai Jumat', () => {
      const start = new Date('2026-05-04'); // Senin, 4 Mei 2026
      const end = new Date('2026-05-08');   // Jumat, 8 Mei 2026
      
      const totalDays = getWorkingDaysBetween(start, end);
      
      // Kita "berharap" (expect) hasilnya adalah 5
      expect(totalDays).toBe(5);
    });

    it('Harus mengabaikan akhir pekan (Sabtu & Minggu)', () => {
      const start = new Date('2026-05-01'); // Jumat, 1 Mei 2026
      const end = new Date('2026-05-04');   // Senin, 4 Mei 2026
      
      const totalDays = getWorkingDaysBetween(start, end);
      
      // Rentangnya adalah Jumat, Sabtu, Minggu, Senin (4 hari).
      // Tapi karena Sabtu dan Minggu diabaikan, hasilnya harus 2 hari (Jumat dan Senin).
      expect(totalDays).toBe(2); 
    });

  });
});