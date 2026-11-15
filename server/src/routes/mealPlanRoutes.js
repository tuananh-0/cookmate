import { Router } from 'express';
import { createMealPlan, deleteMealPlan, listMealPlans, updateMealPlan } from '../controllers/mealPlanController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(listMealPlans));
router.post('/', asyncHandler(createMealPlan));
router.patch('/:id', asyncHandler(updateMealPlan));
router.delete('/:id', asyncHandler(deleteMealPlan));

export default router;
