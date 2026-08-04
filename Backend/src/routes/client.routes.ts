import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
} from '../controllers/client.controller';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getClients));
router.post('/', asyncHandler(createClient));
router.get('/:id', asyncHandler(getClientById));
router.put('/:id', asyncHandler(updateClient));
router.delete('/:id', asyncHandler(deleteClient));

export default router;
