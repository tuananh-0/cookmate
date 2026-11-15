import Recipe from '../models/Recipe.js';
import { normalizeIngredientName } from '../utils/ingredientUtils.js';

export async function listIngredients(_req, res) {
  const ingredientNames = await Recipe.distinct('ingredients.name');
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
  const recipes = await Recipe.find({});
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
  const { search, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) {
    const searchPattern = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { title: searchPattern },
      { description: searchPattern },
      { category: searchPattern },
      { 'ingredients.name': searchPattern },
    ];
  }

  const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
  return res.json({ count: recipes.length, recipes });
}

export async function getRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name');
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  return res.json({ recipe });
}

export async function createRecipe(req, res) {
  const recipe = await Recipe.create({ ...req.body, createdBy: req.user._id });
  return res.status(201).json({ recipe });
}

export async function updateRecipe(req, res) {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
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
