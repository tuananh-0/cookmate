import { Router } from 'express';
import { addShoppingItems, deleteShoppingItem, generateShoppingList, listShoppingItems, updateShoppingItem } from '../controllers/shoppingListController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(listShoppingItems));
router.post('/', asyncHandler(addShoppingItems));
router.post('/generate', asyncHandler(generateShoppingList));
router.patch('/:id', asyncHandler(updateShoppingItem));
router.delete('/:id', asyncHandler(deleteShoppingItem));

export default router;
