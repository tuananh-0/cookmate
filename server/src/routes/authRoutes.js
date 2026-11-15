import { Router } from 'express';
import { getCurrentUser, login, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', requireAuth, getCurrentUser);

export default router;
