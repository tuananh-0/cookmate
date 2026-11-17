import Recipe from '../models/Recipe.js';
import RecipeRating from '../models/RecipeRating.js';
import { normalizeIngredientName } from '../utils/ingredientUtils.js';
import { publicRecipeFilter } from '../utils/recipeVisibility.js';
import { addRatingSummaries } from '../utils/recipeRatings.js';

export async function listIngredients(_req, res) {
  const ingredientNames = await Recipe.distinct('ingredients.name', publicRecipeFilter);
  const uniqueIngredients = new Map();
  for (const name of ingredientNames) {
    if (typeof name !== 'string' || !name.trim()) continue;
    const cleanedName = name.trim().replace(/\s+/g, ' ').normalize('NFC');
    const key = normalizeIngredientName(cleanedName);
    if (!uniqueIngredients.has(key)) uniqueIngredients.set(key, cleanedName);
  }
  const ingredients = [...uniqueIngredients.values()]
    .sort((first, second) => first.localeCompare(second, 'vi'));
  return res.json({ count: ingredients.length, ingredients });
}

export async function matchRecipesByIngredients(req, res) {
  const ingredients = req.body?.ingredients;
  if (!Array.isArray(ingredients) || ingredients.length === 0 || ingredients.length > 30
    || ingredients.some((name) => typeof name !== 'string' || name.trim().length === 0 || name.length > 100)) {
    return res.status(400).json({ message: 'Provide between 1 and 30 valid ingredient names' });
  }

  const availableNames = new Set(ingredients.map(normalizeIngredientName));
  const recipes = await Recipe.find(publicRecipeFilter);
  const matches = recipes.flatMap((recipe) => {
    const recipeIngredients = recipe.ingredients.map((ingredient) => ingredient.toObject());
    const matchedIngredients = recipeIngredients.filter((ingredient) => availableNames.has(normalizeIngredientName(ingredient.name)));
    if (matchedIngredients.length === 0) return [];

    const missingIngredients = recipeIngredients.filter((ingredient) => !availableNames.has(normalizeIngredientName(ingredient.name)));
    return [{
      recipe,
      matchedIngredients,
      missingIngredients,
      matchCount: matchedIngredients.length,
      totalIngredients: recipeIngredients.length,
    }];
  });

  matches.sort((first, second) => {
    const firstRatio = first.matchCount / first.totalIngredients;
    const secondRatio = second.matchCount / second.totalIngredients;
    return secondRatio - firstRatio
      || second.matchCount - first.matchCount
      || first.recipe.title.localeCompare(second.recipe.title, 'vi');
  });

  return res.json({ count: matches.length, recipes: matches });
}

export async function listRecipes(req, res) {
  const { search, category, sort } = req.query;
  const filter = { $and: [publicRecipeFilter] };
  if (category) filter.category = category;
  if (search) {
    const searchPattern = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$and.push({ $or: [
      { title: searchPattern },
      { description: searchPattern },
      { category: searchPattern },
      { 'ingredients.name': searchPattern },
    ] });
  }

  const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
  const ratedRecipes = await addRatingSummaries(recipes, sort === 'rating');
  return res.json({ count: ratedRecipes.length, recipes: ratedRecipes });
}

export async function getRecipe(req, res) {
  const recipe = await Recipe.findOne({ _id: req.params.id, ...publicRecipeFilter }).populate('createdBy', 'name');
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  const [ratedRecipe] = await addRatingSummaries([recipe]);
  return res.json({ recipe: ratedRecipe });
}

export async function getMyRecipeRating(req, res) {
  const recipe = await Recipe.findOne({ _id: req.params.id, ...publicRecipeFilter }).select('_id createdBy');
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  if (String(recipe.createdBy) === String(req.user._id)) {
    return res.status(403).json({ message: 'You cannot rate your own recipe' });
  }
  const rating = await RecipeRating.findOne({ recipe: recipe._id, user: req.user._id }).select('rating');
  return res.json({ rating: rating?.rating || null });
}

export async function saveRecipeRating(req, res) {
  const { rating } = req.body || {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' });
  }

  const recipe = await Recipe.findOne({ _id: req.params.id, ...publicRecipeFilter }).select('_id createdBy');
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  if (String(recipe.createdBy) === String(req.user._id)) {
    return res.status(403).json({ message: 'You cannot rate your own recipe' });
  }

  const savedRating = await RecipeRating.findOneAndUpdate(
    { recipe: recipe._id, user: req.user._id },
    { $set: { rating } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  return res.json({ rating: savedRating.rating });
}

export async function deleteRecipeRating(req, res) {
  const recipe = await Recipe.findOne({ _id: req.params.id, ...publicRecipeFilter }).select('_id');
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  const rating = await RecipeRating.findOneAndDelete({ recipe: recipe._id, user: req.user._id });
  if (!rating) return res.status(404).json({ message: 'Rating not found' });
  return res.status(204).send();
}

export async function createRecipe(req, res) {
  const recipe = await Recipe.create({ ...req.body, createdBy: req.user._id, status: 'approved', reviewedBy: req.user._id, reviewedAt: new Date() });
  return res.status(201).json({ recipe });
}

export async function submitRecipe(req, res) {
  const { ingredients, instructions } = req.body || {};
  if (!Array.isArray(ingredients) || ingredients.length === 0
    || ingredients.some((ingredient) => !ingredient || typeof ingredient.name !== 'string'
      || !ingredient.name.trim() || typeof ingredient.quantity !== 'string' || !ingredient.quantity.trim())) {
    return res.status(400).json({ message: 'Provide at least one ingredient with a name and quantity' });
  }
  if (!Array.isArray(instructions) || instructions.length === 0
    || instructions.some((instruction) => typeof instruction !== 'string' || !instruction.trim())) {
    return res.status(400).json({ message: 'Provide at least one non-empty instruction step' });
  }

  const recipe = await Recipe.create({
    ...req.body,
    createdBy: req.user._id,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: '',
  });
  return res.status(201).json({ recipe });
}

export async function listMySubmissions(req, res) {
  const recipes = await Recipe.find({ createdBy: req.user._id, status: { $in: ['pending', 'approved', 'rejected'] } })
    .select('title category status reviewNote createdAt updatedAt reviewedAt')
    .sort({ createdAt: -1 });
  return res.json({ count: recipes.length, recipes });
}

export async function listReviewQueue(_req, res) {
  const recipes = await Recipe.find({ status: 'pending' })
    .populate('createdBy', 'name email')
    .sort({ createdAt: 1 });
  return res.json({ count: recipes.length, recipes });
}

export async function reviewRecipe(req, res) {
  const { status, reviewNote = '' } = req.body || {};
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Review status must be approved or rejected' });
  }
  if (typeof reviewNote !== 'string' || reviewNote.length > 500) {
    return res.status(400).json({ message: 'Review note must be 500 characters or fewer' });
  }

  const recipe = await Recipe.findOneAndUpdate(
    { _id: req.params.id, status: 'pending' },
    { $set: { status, reviewNote: reviewNote.trim(), reviewedBy: req.user._id, reviewedAt: new Date() } },
    { new: true, runValidators: true },
  ).populate('createdBy', 'name email');
  if (!recipe) return res.status(404).json({ message: 'Pending recipe not found' });
  return res.json({ recipe });
}

export async function updateRecipe(req, res) {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, {
    ...req.body,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: '',
  }, {
    new: true,
    runValidators: true,
  });
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  return res.json({ recipe });
}

export async function deleteRecipe(req, res) {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  return res.status(204).send();
}
