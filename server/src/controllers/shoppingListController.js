import MealPlan from '../models/MealPlan.js';
import ShoppingItem from '../models/ShoppingItem.js';
import { normalizeIngredientName } from '../utils/ingredientUtils.js';
import { publicRecipeFilter } from '../utils/recipeVisibility.js';

export async function listShoppingItems(req, res) {
  const items = await ShoppingItem.find({ user: req.user._id }).sort({ checked: 1, name: 1 });
  return res.json({ count: items.length, items });
}

export async function addShoppingItems(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0 || items.length > 50
    || items.some((item) => !item || typeof item.name !== 'string' || !item.name.trim()
      || item.name.trim().length > 120 || typeof item.quantity !== 'string' || !item.quantity.trim()
      || item.quantity.trim().length > 80)) {
    return res.status(400).json({ message: 'Provide between 1 and 50 valid shopping items' });
  }

  const existingItems = await ShoppingItem.find({ user: req.user._id }).select('name');
  const knownNames = new Set(existingItems.map((item) => normalizeIngredientName(item.name)));
  const additions = [];
  for (const item of items) {
    const name = item.name.trim().replace(/\s+/g, ' ');
    const key = normalizeIngredientName(name);
    if (knownNames.has(key)) continue;
    knownNames.add(key);
    additions.push({ user: req.user._id, name, quantity: item.quantity.trim(), checked: false });
  }

  const createdItems = additions.length ? await ShoppingItem.insertMany(additions) : [];
  return res.status(201).json({ count: createdItems.length, items: createdItems });
}

export async function generateShoppingList(req, res) {
  const mealPlans = await MealPlan.find({ user: req.user._id }).populate({ path: 'recipe', match: publicRecipeFilter });
  const ingredients = new Map();

  for (const mealPlan of mealPlans) {
    for (const ingredient of mealPlan.recipe?.ingredients || []) {
      const key = ingredient.name.trim().toLowerCase();
      const current = ingredients.get(key);
      ingredients.set(key, {
        name: current?.name || ingredient.name.trim(),
        quantity: current ? `${current.quantity} + ${ingredient.quantity}` : ingredient.quantity,
      });
    }
  }

  if (ingredients.size === 0) {
    return res.status(400).json({ message: 'Add a meal plan with available recipes before generating a shopping list' });
  }

  const existingItems = await ShoppingItem.find({ user: req.user._id });
  const checkedByName = new Map(
    existingItems.map((item) => [item.name.trim().toLowerCase(), item.checked]),
  );

  await ShoppingItem.deleteMany({ user: req.user._id });
  const items = await ShoppingItem.insertMany(
    [...ingredients.entries()].map(([key, item]) => ({
      ...item,
      checked: checkedByName.get(key) || false,
      user: req.user._id,
    })),
  );
  return res.status(201).json({ count: items.length, items });
}

export async function updateShoppingItem(req, res) {
  const updates = {};
  if (Object.hasOwn(req.body, 'checked')) updates.checked = req.body.checked;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  const item = await ShoppingItem.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: updates },
    { new: true, runValidators: true },
  );
  if (!item) return res.status(404).json({ message: 'Shopping item not found' });
  return res.json({ item });
}

export async function deleteShoppingItem(req, res) {
  const item = await ShoppingItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) return res.status(404).json({ message: 'Shopping item not found' });
  return res.status(204).send();
}
