import { Router } from 'express';
import { createRecipe, deleteRecipe, getRecipe, listRecipes, updateRecipe } from '../controllers/recipeController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listRecipes);
router.get('/:id', getRecipe);
router.post('/', requireAuth, requireRole('admin'), createRecipe);
router.patch('/:id', requireAuth, requireRole('admin'), updateRecipe);
router.delete('/:id', requireAuth, requireRole('admin'), deleteRecipe);

export default router;
