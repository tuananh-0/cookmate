import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cookmate-api' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/meal-plans', mealPlanRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
