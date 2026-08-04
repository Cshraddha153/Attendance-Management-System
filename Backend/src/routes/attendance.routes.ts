import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import {
  getAttendance,
  markAttendance,
  deleteAttendance,
} from '../controllers/attendance.controller';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', asyncHandler(getAttendance));
router.post('/', asyncHandler(markAttendance));
router.delete('/:attendanceId', asyncHandler(deleteAttendance));

export default router;
