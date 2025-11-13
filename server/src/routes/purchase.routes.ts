import { Router } from 'express';
import { simulatePurchase } from '../controllers/purchase.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// @route   POST /api/purchase
// This route is protected. Only logged-in users can access it.
router.post('/', protect, simulatePurchase);

export default router;