import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import reimburseRoutes from './routes/reimburseRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ROUTING
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/reimbursements', reimburseRoutes);
app.use('/api/payroll', payrollRoutes);




app.listen(PORT, () => {
  console.log(`🚀 Server gacor di http://localhost:${PORT}`);
});