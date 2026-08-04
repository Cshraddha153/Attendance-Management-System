import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}
