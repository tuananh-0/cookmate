import { Router } from 'express';
import { deleteShoppingItem, generateShoppingList, listShoppingItems, updateShoppingItem } from '../controllers/shoppingListController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', listShoppingItems);
router.post('/generate', generateShoppingList);
router.patch('/:id', updateShoppingItem);
router.delete('/:id', deleteShoppingItem);

export default router;
