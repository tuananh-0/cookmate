import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import shoppingListRoutes from './routes/shoppingListRoutes.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpecification from './docs/openapi.js';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header (for example, Postman or health checks)
    // are not browser cross-origin requests and remain available.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
}));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cookmate-api' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/meal-plans', mealPlanRoutes);
app.use('/api/v1/shopping-list', shoppingListRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
