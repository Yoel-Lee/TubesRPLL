import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export const initAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (adminExists) return res.status(400).json({ message: 'Admin sudah ada!' });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { name: 'Super Admin', email: 'admin@hris.com', password: hashedPassword, role: 'ADMIN' }
    });
    res.status(201).json({ message: 'Admin berhasil dibuat!' });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Kredensial salah!' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 1. Lupa Password - Generate Link
export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "Email tidak terdaftar" });

    // Buat token sementara (berlaku 15 menit)
    const resetToken = jwt.sign({ id: user.id }, 'RESET_SECRET', { expiresIn: '15m' });

    // Simulasi kirim email (di industri pakai Nodemailer/SendGrid)
    console.log(`--- SIMULASI EMAIL ---`);
    console.log(`Ke: ${email}`);
    console.log(`Link: http://localhost:5173/reset-password/${resetToken}`);
    
    res.json({ message: "Instruksi reset password telah dikirim ke email (Cek console log server)" });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// 2. Reset Password - Simpan Password Baru
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, newPassword } = req.body;

    // Verifikasi token
    const decoded: any = jwt.verify(token, 'RESET_SECRET');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    res.json({ message: "Password berhasil diperbarui, silakan login kembali." });
  } catch (error) {
    res.status(400).json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }
};