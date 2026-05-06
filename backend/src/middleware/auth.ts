import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
   console.log('AUTH HEADER:', req.headers.authorization);
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Anda belum login (Token tidak ada)!' });
  }

  const token = authHeader.split(' ')[1];

if (!token) {
  return res.status(401).json({ message: 'Token tidak ditemukan!' });
}

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as { id: number; role: string };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluarsa!' });
  }
};

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction): any => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Akses ditolak. Fitur ini khusus ADMIN!' });
  }
  next();
};

export const verifyAdminOrManager = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const role = req.user?.role;
  if (role !== 'ADMIN' && role !== 'MANAGER') {
    return res.status(403).json({ message: 'Akses ditolak. Fitur ini khusus ADMIN atau MANAGER!' });
  }
  next();
};