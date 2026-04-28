import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// load env dari .env
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors()); 
app.use(express.json()); 

//  test
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Selamat datang di API HRIS!',
    status: 'Server berjalan dengan baik',
  });
});

// simulasi dummy
app.get('/api/users', (req: Request, res: Response) => {
  const dummyUsers = [
    { id: 1, name: 'Pak Bos Admin', role: 'admin' },
    { id: 2, name: 'Budi Santoso', role: 'staff' }
  ];
  res.json(dummyUsers);
});

// server
app.listen(PORT, () => {
  console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});