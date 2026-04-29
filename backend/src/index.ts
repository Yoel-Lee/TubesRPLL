import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

app.use(cors());
app.use(express.json());

// --- ENDPOINT TEST ---
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server HRIS Express menyala dengan sukses!' });
});

app.get('/api/test-db', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: 'Koneksi ke PostgreSQL gacor!', totalUsers: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Gagal terhubung ke database', error: String(error) });
  }
});

// --- 1. SETUP ADMIN PERTAMA (Hanya Dijalankan Sekali) ---
app.post('/api/init-admin', async (req: Request, res: Response): Promise<any> => {
  try {
    // Cek apakah admin sudah ada biar tidak double
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin sudah ada di database!' });
    }

    // Hash password "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Buat user admin
    const admin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@hris.com',
        password: hashedPassword,
        role: 'ADMIN',
      }
    });

    res.status(201).json({ 
      message: 'Admin berhasil dibuat!', 
      email: admin.email,
      passwordRaw: 'admin123' // Info sementara untuk Anda test login
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat admin', error: String(error) });
  }
});

// --- 2. ENDPOINT LOGIN ---
app.post('/api/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'Email tidak ditemukan!' });
    }

    // 2. Cek apakah password cocok
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password salah!' });
    }

    // 3. Buat Token JWT (Berisi ID dan Role)
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' } // Token berlaku 1 hari
    );

    // 4. Kirim respon sukses
    res.status(200).json({
      message: 'Login berhasil!',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});