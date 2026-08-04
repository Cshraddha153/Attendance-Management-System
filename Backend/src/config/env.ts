import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required. See .env.example.');
}

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Using an insecure default for development only.');
}

export const env = {
  mongodbUri: MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};
