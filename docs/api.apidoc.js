/**
 * @api {get} /api/v1/health Health check
 * @apiName HealthCheck
 * @apiGroup Health
 * @apiSuccess {String} status Service status (`ok`).
 * @apiSuccess {String} service Service name.
 * @apiDescription Checks that the CookMate API process is responding.
 */

/**
 * @api {post} /api/v1/auth/register Register
 * @apiName Register
 * @apiGroup Authentication
 * @apiBody {String} name Display name (maximum 80 characters).
 * @apiBody {String} email Unique email address.
 * @apiBody {String} password Password of at least 8 characters containing uppercase, lowercase, and a number.
 * @apiSuccess {String} token JWT used as a Bearer token.
 * @apiSuccess {Object} user Created user (`id`, `name`, `email`, `role`).
 * @apiError (400) BadRequest Required fields are missing or password policy is not met.
 * @apiError (409) Conflict Email is already registered.
 * @apiDescription Creates a user account. Newly registered accounts have the `user` role.
 */

/**
 * @api {post} /api/v1/auth/login Login
 * @apiName Login
 * @apiGroup Authentication
 * @apiBody {String} email Account email.
 * @apiBody {String} password Account password.
 * @apiSuccess {String} token JWT used as a Bearer token.
 * @apiSuccess {Object} user Authenticated user (`id`, `name`, `email`, `role`).
 * @apiError (401) Unauthorized Email or password is invalid.
 * @apiDescription Authenticates a user and returns a JWT.
 */

/**
 * @api {get} /api/v1/auth/me Current user
 * @apiName GetCurrentUser
 * @apiGroup Authentication
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiSuccess {Object} user Current user (`id`, `name`, `email`, `role`).
 * @apiError (401) Unauthorized Token is missing, invalid, expired, or its user no longer exists.
 * @apiDescription Returns the account associated with the supplied JWT.
 */

/**
 * @api {get} /api/v1/recipes List and search recipes
 * @apiName ListRecipes
 * @apiGroup Recipes
 * @apiParam {String} [search] Case-insensitive partial search across title, description, category, and ingredient names.
 * @apiParam {String} [category] Exact category filter.
 * @apiSuccess {Number} count Number of matching recipes.
 * @apiSuccess {Object[]} recipes Matching recipe records.
 * @apiDescription Lists recipes. Search and category filters can be combined.
 */

/**
 * @api {get} /api/v1/recipes/:id Recipe detail
 * @apiName GetRecipe
 * @apiGroup Recipes
 * @apiParam {String} id Recipe MongoDB ID.
 * @apiSuccess {Object} recipe Recipe including ingredients, instructions, category, preparation/cooking times, servings, and creator.
 * @apiError (404) NotFound Recipe does not exist.
 * @apiDescription Returns one recipe by ID.
 */

/**
 * @api {post} /api/v1/recipes Create recipe
 * @apiName CreateRecipe
 * @apiGroup Recipes
 * @apiHeader {String} Authorization `Bearer <admin-token>`.
 * @apiBody {String} title Recipe title (maximum 120 characters).
 * @apiBody {String} description Recipe description (maximum 500 characters).
 * @apiBody {Object[]} ingredients Ingredient entries with `name` and `quantity`.
 * @apiBody {String[]} instructions Ordered preparation steps.
 * @apiBody {String} category Recipe category.
 * @apiBody {String} [imageUrl] Image URL.
 * @apiBody {Number} [prepTime=0] Preparation time in minutes.
 * @apiBody {Number} [cookTime=0] Cooking time in minutes.
 * @apiBody {Number} [servings=1] Number of servings.
 * @apiSuccess (201) {Object} recipe Created recipe.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (403) Forbidden User is not an admin.
 * @apiDescription Creates a recipe. The creator is taken from the authenticated admin.
 */

/**
 * @api {patch} /api/v1/recipes/:id Update recipe
 * @apiName UpdateRecipe
 * @apiGroup Recipes
 * @apiHeader {String} Authorization `Bearer <admin-token>`.
 * @apiParam {String} id Recipe MongoDB ID.
 * @apiBody {String} [title] Updated title.
 * @apiBody {String} [description] Updated description.
 * @apiBody {Object[]} [ingredients] Updated ingredients (`name`, `quantity`).
 * @apiBody {String[]} [instructions] Updated ordered steps.
 * @apiBody {String} [category] Updated category.
 * @apiBody {String} [imageUrl] Updated image URL.
 * @apiBody {Number} [prepTime] Preparation time in minutes.
 * @apiBody {Number} [cookTime] Cooking time in minutes.
 * @apiBody {Number} [servings] Number of servings.
 * @apiSuccess {Object} recipe Updated recipe.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (403) Forbidden User is not an admin.
 * @apiError (404) NotFound Recipe does not exist.
 * @apiDescription Updates a recipe using the supplied fields.
 */

/**
 * @api {delete} /api/v1/recipes/:id Delete recipe
 * @apiName DeleteRecipe
 * @apiGroup Recipes
 * @apiHeader {String} Authorization `Bearer <admin-token>`.
 * @apiParam {String} id Recipe MongoDB ID.
 * @apiSuccess (204) NoContent Recipe was deleted.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (403) Forbidden User is not an admin.
 * @apiError (404) NotFound Recipe does not exist.
 * @apiDescription Permanently deletes a recipe.
 */

/**
 * @api {get} /api/v1/favorites List favorites
 * @apiName ListFavorites
 * @apiGroup Favorites
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiSuccess {Number} count Number of favorites.
 * @apiSuccess {Object[]} favorites Favorite records with populated recipes.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiDescription Lists the authenticated user's favorite recipes.
 */

/**
 * @api {post} /api/v1/favorites/:recipeId Add favorite
 * @apiName AddFavorite
 * @apiGroup Favorites
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiParam {String} recipeId Recipe MongoDB ID.
 * @apiSuccess (201) {Object} favorite Created favorite record.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (404) NotFound Recipe does not exist.
 * @apiError (409) Conflict Recipe is already a favorite.
 * @apiDescription Adds a recipe to the authenticated user's favorites.
 */

/**
 * @api {delete} /api/v1/favorites/:recipeId Remove favorite
 * @apiName RemoveFavorite
 * @apiGroup Favorites
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiParam {String} recipeId Recipe MongoDB ID.
 * @apiSuccess (204) NoContent Favorite was removed.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (404) NotFound Favorite does not exist for this user.
 * @apiDescription Removes a recipe from the authenticated user's favorites.
 */

/**
 * @api {get} /api/v1/meal-plans List meal plans
 * @apiName ListMealPlans
 * @apiGroup MealPlans
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiParam {String} [dateFrom] Inclusive start date in `YYYY-MM-DD` format.
 * @apiParam {String} [dateTo] Inclusive end date in `YYYY-MM-DD` format.
 * @apiSuccess {Number} count Number of meal plans.
 * @apiSuccess {Object[]} mealPlans User meal plans with populated recipes.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiDescription Lists the authenticated user's meal plans, optionally filtered by date range.
 */

/**
 * @api {post} /api/v1/meal-plans Create meal plan
 * @apiName CreateMealPlan
 * @apiGroup MealPlans
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiBody {String} date Date in `YYYY-MM-DD` format.
 * @apiBody {String="breakfast","lunch","dinner","snack"} mealType Meal slot.
 * @apiBody {String} recipeId Recipe MongoDB ID.
 * @apiBody {String} [note] Optional note (maximum 200 characters).
 * @apiSuccess (201) {Object} mealPlan Created meal plan with populated recipe.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (404) NotFound Recipe does not exist.
 * @apiError (409) Conflict The user already has a plan for this date and meal slot.
 * @apiDescription Adds a recipe to a meal slot for the authenticated user.
 */

/**
 * @api {patch} /api/v1/meal-plans/:id Update meal plan
 * @apiName UpdateMealPlan
 * @apiGroup MealPlans
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiParam {String} id Meal plan MongoDB ID.
 * @apiBody {String} [date] Date in `YYYY-MM-DD` format.
 * @apiBody {String} [mealType] One of `breakfast`, `lunch`, `dinner`, `snack`.
 * @apiBody {String} [recipeId] Replacement recipe MongoDB ID.
 * @apiBody {String} [note] Optional note.
 * @apiSuccess {Object} mealPlan Updated meal plan.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (404) NotFound Meal plan or replacement recipe does not exist.
 * @apiDescription Updates a meal plan owned by the authenticated user.
 */

/**
 * @api {delete} /api/v1/meal-plans/:id Delete meal plan
 * @apiName DeleteMealPlan
 * @apiGroup MealPlans
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiParam {String} id Meal plan MongoDB ID.
 * @apiSuccess (204) NoContent Meal plan was deleted.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (404) NotFound Meal plan does not exist for this user.
 * @apiDescription Deletes a meal plan owned by the authenticated user.
 */

/**
 * @api {get} /api/v1/shopping-list Get shopping list
 * @apiName GetShoppingList
 * @apiGroup ShoppingList
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiSuccess {Number} count Number of items.
 * @apiSuccess {Object[]} items Shopping items with `name`, `quantity`, and `checked`.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiDescription Lists the authenticated user's shopping items.
 */

/**
 * @api {post} /api/v1/shopping-list/generate Generate shopping list
 * @apiName GenerateShoppingList
 * @apiGroup ShoppingList
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiSuccess (201) {Number} count Number of generated items.
 * @apiSuccess (201) {Object[]} items Ingredients collected from the user's meal plans and combined by ingredient name.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiDescription Replaces the user's shopping list with ingredients from current meal plans.
 */

/**
 * @api {patch} /api/v1/shopping-list/:id Update shopping item
 * @apiName UpdateShoppingItem
 * @apiGroup ShoppingList
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiParam {String} id Shopping item MongoDB ID.
 * @apiBody {Boolean} [checked] Whether the item has been purchased.
 * @apiBody {String} [name] Ingredient name.
 * @apiBody {String} [quantity] Ingredient quantity.
 * @apiSuccess {Object} item Updated shopping item.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (404) NotFound Item does not exist for this user.
 * @apiDescription Updates an item owned by the authenticated user.
 */

/**
 * @api {delete} /api/v1/shopping-list/:id Delete shopping item
 * @apiName DeleteShoppingItem
 * @apiGroup ShoppingList
 * @apiHeader {String} Authorization `Bearer <token>`.
 * @apiParam {String} id Shopping item MongoDB ID.
 * @apiSuccess (204) NoContent Item was deleted.
 * @apiError (401) Unauthorized Token is missing or invalid.
 * @apiError (404) NotFound Item does not exist for this user.
 * @apiDescription Deletes an item owned by the authenticated user.
 */
