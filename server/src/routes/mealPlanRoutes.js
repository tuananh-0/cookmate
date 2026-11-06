import { Router } from 'express';
import { createMealPlan, deleteMealPlan, listMealPlans, updateMealPlan } from '../controllers/mealPlanController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', listMealPlans);
router.post('/', createMealPlan);
router.patch('/:id', updateMealPlan);
router.delete('/:id', deleteMealPlan);

export default router;
