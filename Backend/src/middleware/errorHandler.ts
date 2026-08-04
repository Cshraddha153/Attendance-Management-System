import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with these details already exists' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong' });
}
