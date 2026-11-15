import { Router } from 'express';
import { createRecipe, deleteRecipe, getRecipe, listIngredients, listRecipes, matchRecipesByIngredients, updateRecipe } from '../controllers/recipeController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(listRecipes));
router.get('/ingredients', asyncHandler(listIngredients));
router.post('/match', asyncHandler(matchRecipesByIngredients));
router.get('/:id', asyncHandler(getRecipe));
router.post('/', requireAuth, requireRole('admin'), asyncHandler(createRecipe));
router.patch('/:id', requireAuth, requireRole('admin'), asyncHandler(updateRecipe));
router.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(deleteRecipe));

export default router;
