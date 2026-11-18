import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CookMate API',
      version: '1.0.0',
      description: 'CookMate API for recipe discovery, ingredient matching, user-submitted recipes with admin moderation, 1–5 star ratings, favorites, meal planning, and shopping lists. Public recipe endpoints expose published recipes. Protected endpoints use a JWT bearer token.',
    },
    servers: [
      { url: 'https://cookmate-j4o2.onrender.com', description: 'Production' },
      { url: 'http://localhost:5000', description: 'Local development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Ingredient: {
          type: 'object', required: ['name', 'quantity'],
          properties: { name: { type: 'string', example: 'Rice noodles' }, quantity: { type: 'string', example: '200g' } },
        },
        RecipeInput: {
          type: 'object',
          required: ['title', 'description', 'ingredients', 'instructions', 'category'],
          properties: {
            title: { type: 'string', maxLength: 120, example: 'Pho bo' },
            description: { type: 'string', maxLength: 500 },
            ingredients: { type: 'array', minItems: 1, items: { $ref: '#/components/schemas/Ingredient' } },
            instructions: { type: 'array', minItems: 1, items: { type: 'string' } },
            category: { type: 'string' },
            imageUrl: { type: 'string' },
            prepTime: { type: 'number', minimum: 0 },
            cookTime: { type: 'number', minimum: 0 },
            servings: { type: 'number', minimum: 1 },
          },
          additionalProperties: false,
        },
        Recipe: {
          type: 'object', required: ['title', 'description', 'ingredients', 'instructions', 'category'],
          properties: {
            _id: { type: 'string' }, title: { type: 'string', example: 'Pho bo' },
            description: { type: 'string' }, ingredients: { type: 'array', items: { $ref: '#/components/schemas/Ingredient' } },
            instructions: { type: 'array', items: { type: 'string' } }, category: { type: 'string' },
            imageUrl: { type: 'string' }, prepTime: { type: 'number', example: 15 },
            cookTime: { type: 'number', example: 30 }, servings: { type: 'number', example: 2 },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            reviewNote: { type: 'string', maxLength: 500 },
            ratingAverage: { type: 'number', minimum: 0, maximum: 5 },
            ratingCount: { type: 'integer', minimum: 0 },
          },
        },
        RecipeUpdate: {
          type: 'object',
          minProperties: 1,
          description: 'Send only fields to change. Editing a published recipe returns it to pending review.',
          properties: {
            title: { type: 'string', maxLength: 120 },
            description: { type: 'string', maxLength: 500 },
            ingredients: { type: 'array', items: { $ref: '#/components/schemas/Ingredient' } },
            instructions: { type: 'array', items: { type: 'string' } },
            category: { type: 'string' },
            imageUrl: { type: 'string' },
            prepTime: { type: 'number', minimum: 0 },
            cookTime: { type: 'number', minimum: 0 },
            servings: { type: 'number', minimum: 1 },
          },
          additionalProperties: false,
        },
        RecipeRating: {
          type: 'object', required: ['rating'],
          properties: {
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
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
 * /api/v1/recipes/ingredients:
 *   get:
 *     summary: List ingredient names available for recipe matching
 *     tags: [Recipes]
 *     responses:
 *       200: { description: Ingredient names available for matching. }
 * /api/v1/recipes/match:
 *   post:
 *     summary: Find published recipes using available ingredients
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ingredients]
 *             properties:
 *               ingredients:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 30
 *                 items: { type: string }
 *     responses:
 *       200:
 *         description: Recipes are ranked by matched-ingredient ratio (matched ingredients divided by total recipe ingredients), then by matched count, then by title. Names are compared exactly after case, whitespace, and Unicode normalization; similar or substitute names are not inferred. Each result includes matched and missing ingredients.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count: { type: integer }
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       recipe: { $ref: '#/components/schemas/Recipe' }
 *                       matchedIngredients: { type: array, items: { $ref: '#/components/schemas/Ingredient' } }
 *                       missingIngredients: { type: array, items: { $ref: '#/components/schemas/Ingredient' } }
 *                       matchCount: { type: integer }
 *                       totalIngredients: { type: integer }
 *       400: { description: Invalid ingredient list. }
 *
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
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [newest, rating] }
 *         description: Sort by newest (default) or confidence-weighted rating.
 *     responses:
 *       200: { description: Public approved recipes with ratingAverage and ratingCount. Rating sorting uses a confidence-weighted score to avoid over-promoting recipes with very few ratings. }
 *   post:
 *     summary: Create recipe (admin only)
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RecipeInput' }
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
 *     summary: Update a recipe; edits return it to pending review
 *     security: [{ bearerAuth: [] }]
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RecipeUpdate' }
 *     responses:
 *       200: { description: Updated recipe, now pending admin review. }
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
 * /api/v1/recipes/{id}/review:
 *   patch:
 *     summary: Approve or reject a pending recipe (admin only)
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [approved, rejected] }
 *               reviewNote: { type: string, maxLength: 500 }
 *     responses:
 *       200: { description: Review saved. Approved recipes are published. }
 *       400: { description: Invalid review status or note. }
 *       403: { description: Admin role required. }
 *       404: { description: Pending recipe not found. }
 * /api/v1/recipes/submissions:
 *   post:
 *     summary: Submit a recipe for admin review
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RecipeInput' }
 *     responses:
 *       201: { description: Recipe submitted with pending status. }
 *       401: { description: Authentication required. }
 * /api/v1/recipes/submissions/mine:
 *   get:
 *     summary: List the current user's recipe submissions and review status
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current user's submissions, including review feedback. }
 *       401: { description: Authentication required. }
 * /api/v1/recipes/review-queue:
 *   get:
 *     summary: List pending recipes for admin review
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Pending recipes and submitter details. }
 *       401: { description: Authentication required. }
 *       403: { description: Admin role required. }
 * /api/v1/recipes/{id}/ratings/me:
 *   get:
 *     summary: Get the current user's rating for a recipe
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Current user's rating, or null if not rated. }
 *       401: { description: Authentication required. }
 *       403: { description: Authors cannot rate their own recipe. }
 *       404: { description: Recipe not found or not published. }
 * /api/v1/recipes/{id}/ratings:
 *   put:
 *     summary: Create or update the current user's recipe rating
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RecipeRating' }
 *     responses:
 *       200: { description: Rating saved. One rating per user and recipe; subsequent calls update it. }
 *       400: { description: Rating must be a whole number from 1 to 5. }
 *       401: { description: Authentication required. }
 *       403: { description: Authors cannot rate their own recipe. }
 *       404: { description: Recipe not found or not published. }
 *   delete:
 *     summary: Remove the current user's rating
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Rating removed. }
 *       401: { description: Authentication required. }
 *       404: { description: Recipe or current user's rating not found. }
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
 *   post:
 *     summary: Add missing ingredients to the current user's shopping list
 *     tags: [Shopping List]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 50
 *                 items:
 *                   $ref: '#/components/schemas/Ingredient'
 *     responses:
 *       201: { description: New items added; existing names are skipped. }
 *       400: { description: Invalid item list. }
 *       401: { description: Authentication required. }
 * /api/v1/shopping-list/generate:
 *   post:
 *     summary: Generate shopping list from meal plans
 *     tags: [Shopping List]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Adds meal-plan ingredients not already on the list, combines duplicate names from the plans, preserves existing items and checked state, and avoids duplicates on repeated calls.
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
 *           schema: { type: object, required: [checked], properties: { checked: { type: boolean, description: Whether the item has been purchased. } } }
 *     responses:
 *       200: { description: Updated shopping item. }
 *       400: { description: The checked field is required and must be a boolean. }
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
