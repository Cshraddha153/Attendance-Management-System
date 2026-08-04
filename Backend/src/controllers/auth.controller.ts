import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: (env.nodeEnv === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(user._id.toString());
  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user._id.toString());
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ user: { id: user._id, name: user.name, email: user.email } });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token', {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
  });
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user: { id: user._id, name: user.name, email: user.email } });
}
