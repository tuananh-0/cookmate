import { Router } from 'express';
import { addFavorite, listFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(listFavorites));
router.post('/:recipeId', asyncHandler(addFavorite));
router.delete('/:recipeId', asyncHandler(removeFavorite));

export default router;
