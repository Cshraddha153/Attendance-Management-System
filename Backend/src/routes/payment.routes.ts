import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { getPayments, createPayment, deletePayment } from '../controllers/payment.controller';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', asyncHandler(getPayments));
router.post('/', asyncHandler(createPayment));
router.delete('/:paymentId', asyncHandler(deletePayment));

export default router;
