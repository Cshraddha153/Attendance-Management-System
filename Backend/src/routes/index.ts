import { Router } from 'express';
import authRoutes from './auth.routes';
import clientRoutes from './client.routes';
import attendanceRoutes from './attendance.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/clients/:clientId/attendance', attendanceRoutes);
router.use('/clients/:clientId/payments', paymentRoutes);

export default router;
