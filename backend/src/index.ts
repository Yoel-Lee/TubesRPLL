import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';


const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Server nyala' 
  });
});

// 2. test endpont api
app.get('/api/test-db', async (req: Request, res: Response) => {
  try {
    
    const users = await prisma.user.findMany();
    //masih kosong , tapi sekedar test aja berhasil ga
    res.status(200).json({
      message: 'Koneksi ke PostgreSQL gacor!',
      totalUsers: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error Database:', error);
    res.status(500).json({ 
      message: 'Gagal terhubung ke database. Cek DATABASE_URL di file .env', 
      error: String(error) 
    });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});