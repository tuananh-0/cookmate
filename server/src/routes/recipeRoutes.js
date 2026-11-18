import { Router } from 'express';
import { createRecipe, deleteRecipe, deleteRecipeRating, getMyRecipeRating, getRecipe, listIngredients, listMySubmissions, listRecipes, listReviewQueue, matchRecipesByIngredients, reviewRecipe, saveRecipeRating, submitRecipe, updateRecipe } from '../controllers/recipeController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(listRecipes));
router.get('/ingredients', asyncHandler(listIngredients));
router.post('/match', asyncHandler(matchRecipesByIngredients));
router.post('/submissions', requireAuth, asyncHandler(submitRecipe));
router.get('/submissions/mine', requireAuth, asyncHandler(listMySubmissions));
router.get('/review-queue', requireAuth, requireRole('admin'), asyncHandler(listReviewQueue));
router.patch('/:id/review', requireAuth, requireRole('admin'), asyncHandler(reviewRecipe));
router.get('/:id/ratings/me', requireAuth, asyncHandler(getMyRecipeRating));
router.put('/:id/ratings', requireAuth, asyncHandler(saveRecipeRating));
router.delete('/:id/ratings', requireAuth, asyncHandler(deleteRecipeRating));
router.get('/:id', asyncHandler(getRecipe));
router.post('/', requireAuth, requireRole('admin'), asyncHandler(createRecipe));
router.patch('/:id', requireAuth, requireRole('admin'), asyncHandler(updateRecipe));
router.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(deleteRecipe));

export default router;
