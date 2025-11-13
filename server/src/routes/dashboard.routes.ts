import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// @route   GET /api/dashboard
// This route is protected.
router.get('/', protect, getDashboardData);

export default router;