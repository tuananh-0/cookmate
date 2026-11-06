import MealPlan from '../models/MealPlan.js';
import Recipe from '../models/Recipe.js';

export async function listMealPlans(req, res) {
  const filter = { user: req.user._id };
  if (req.query.dateFrom || req.query.dateTo) {
    filter.date = {};
    if (req.query.dateFrom) filter.date.$gte = req.query.dateFrom;
    if (req.query.dateTo) filter.date.$lte = req.query.dateTo;
  }

  const mealPlans = await MealPlan.find(filter).populate('recipe').sort({ date: 1, mealType: 1 });
  return res.json({ count: mealPlans.length, mealPlans });
}

export async function createMealPlan(req, res) {
  const { date, mealType, recipeId, note } = req.body;
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const existing = await MealPlan.findOne({ user: req.user._id, date, mealType });
  if (existing) return res.status(409).json({ message: 'This meal slot is already planned' });

  const mealPlan = await MealPlan.create({ user: req.user._id, date, mealType, recipe: recipeId, note });
  await mealPlan.populate('recipe');
  return res.status(201).json({ mealPlan });
}

export async function updateMealPlan(req, res) {
  const updates = { ...req.body };
  if (updates.recipeId) {
    const recipe = await Recipe.findById(updates.recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    updates.recipe = updates.recipeId;
    delete updates.recipeId;
  }

  const mealPlan = await MealPlan.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true },
  ).populate('recipe');
  if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
  return res.json({ mealPlan });
}

export async function deleteMealPlan(req, res) {
  const mealPlan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
  return res.status(204).send();
}
