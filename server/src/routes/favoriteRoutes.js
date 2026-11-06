import { Router } from 'express';
import { addFavorite, listFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', listFavorites);
router.post('/:recipeId', addFavorite);
router.delete('/:recipeId', removeFavorite);

export default router;
