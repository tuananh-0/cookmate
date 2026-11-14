import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CookMate API',
      version: '1.0.0',
      description: 'API for recipe discovery, favorites, meal planning, and shopping lists.',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Local development' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Ingredient: {
          type: 'object', required: ['name', 'quantity'],
          properties: { name: { type: 'string', example: 'Rice noodles' }, quantity: { type: 'string', example: '200g' } },
        },
        Recipe: {
          type: 'object', required: ['title', 'description', 'ingredients', 'instructions', 'category'],
          properties: {
            _id: { type: 'string' }, title: { type: 'string', example: 'Pho bo' },
            description: { type: 'string' }, ingredients: { type: 'array', items: { $ref: '#/components/schemas/Ingredient' } },
            instructions: { type: 'array', items: { type: 'string' } }, category: { type: 'string' },
            imageUrl: { type: 'string' }, prepTime: { type: 'number', example: 15 },
            cookTime: { type: 'number', example: 30 }, servings: { type: 'number', example: 2 },
          },
        },
        Error: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
  },
  apis: ['./src/docs/openapi.js'],
};

export default swaggerJsdoc(options);

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is responding.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 service: { type: string, example: cookmate-api }
 */

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Test User }
 *               email: { type: string, format: email, example: test@example.com }
 *               password: { type: string, format: password, minLength: 8, example: Cookmate123 }
 *     responses:
 *       201:
 *         description: Account created; response contains token and user.
 *       400: { description: Missing fields or password policy failed. }
 *       409: { description: Email is already registered. }
 */

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: Authenticated; returns JWT and user. }
 *       401: { description: Invalid email or password. }
 */

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current authenticated user. }
 *       401: { description: Missing, invalid, or expired token. }
 */

/**
 * @openapi
 * /api/v1/recipes:
 *   get:
 *     summary: List and search recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Case-insensitive partial match in title, description, category, and ingredient names.
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200: { description: Recipe list and count. }
 *   post:
 *     summary: Create recipe (admin only)
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Recipe' }
 *     responses:
 *       201: { description: Recipe created. }
 *       401: { description: Authentication required. }
 *       403: { description: Admin role required. }
 * /api/v1/recipes/{id}:
 *   get:
 *     summary: Get recipe details
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Recipe details. }
 *       404: { description: Recipe not found. }
 *   patch:
 *     summary: Update recipe (admin only)
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Recipe' }
 *     responses:
 *       200: { description: Updated recipe. }
 *       403: { description: Admin role required. }
 *       404: { description: Recipe not found. }
 *   delete:
 *     summary: Delete recipe (admin only)
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Recipe deleted. }
 *       403: { description: Admin role required. }
 *       404: { description: Recipe not found. }
 * /api/v1/favorites:
 *   get:
 *     summary: List current user's favorites
 *     tags: [Favorites]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Favorite recipes. }
 * /api/v1/favorites/{recipeId}:
 *   post:
 *     summary: Add recipe to favorites
 *     tags: [Favorites]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201: { description: Favorite added. }
 *       404: { description: Recipe not found. }
 *       409: { description: Recipe already favorited. }
 *   delete:
 *     summary: Remove recipe from favorites
 *     tags: [Favorites]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Favorite removed. }
 *       404: { description: Favorite not found. }
 * /api/v1/meal-plans:
 *   get:
 *     summary: List meal plans
 *     tags: [Meal Plans]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: Current user's meal plans. }
 *   post:
 *     summary: Create meal plan
 *     tags: [Meal Plans]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, mealType, recipeId]
 *             properties:
 *               date: { type: string, format: date, example: '2026-11-20' }
 *               mealType: { type: string, enum: [breakfast, lunch, dinner, snack] }
 *               recipeId: { type: string }
 *               note: { type: string }
 *     responses:
 *       201: { description: Meal plan created. }
 *       404: { description: Recipe not found. }
 *       409: { description: Meal slot already planned. }
 * /api/v1/meal-plans/{id}:
 *   patch:
 *     summary: Update meal plan
 *     tags: [Meal Plans]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object, properties: { date: { type: string, format: date }, mealType: { type: string }, recipeId: { type: string }, note: { type: string } } }
 *     responses:
 *       200: { description: Meal plan updated. }
 *       404: { description: Meal plan or recipe not found. }
 *   delete:
 *     summary: Delete meal plan
 *     tags: [Meal Plans]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Meal plan deleted. }
 *       404: { description: Meal plan not found. }
 * /api/v1/shopping-list:
 *   get:
 *     summary: Get shopping list
 *     tags: [Shopping List]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current user's shopping items. }
 * /api/v1/shopping-list/generate:
 *   post:
 *     summary: Generate shopping list from meal plans
 *     tags: [Shopping List]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Replaces list with ingredients from meal plans, combining duplicate names. }
 * /api/v1/shopping-list/{id}:
 *   patch:
 *     summary: Update shopping item
 *     tags: [Shopping List]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object, properties: { checked: { type: boolean }, name: { type: string }, quantity: { type: string } } }
 *     responses:
 *       200: { description: Updated shopping item. }
 *       404: { description: Item not found. }
 *   delete:
 *     summary: Delete shopping item
 *     tags: [Shopping List]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Item deleted. }
 *       404: { description: Item not found. }
 */
