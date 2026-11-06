import MealPlan from '../models/MealPlan.js';
import ShoppingItem from '../models/ShoppingItem.js';

export async function listShoppingItems(req, res) {
  const items = await ShoppingItem.find({ user: req.user._id }).sort({ checked: 1, name: 1 });
  return res.json({ count: items.length, items });
}

export async function generateShoppingList(req, res) {
  const mealPlans = await MealPlan.find({ user: req.user._id }).populate('recipe');
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

  await ShoppingItem.deleteMany({ user: req.user._id });
  const items = await ShoppingItem.insertMany(
    [...ingredients.values()].map((item) => ({ ...item, user: req.user._id })),
  );
  return res.status(201).json({ count: items.length, items });
}

export async function updateShoppingItem(req, res) {
  const item = await ShoppingItem.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
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
