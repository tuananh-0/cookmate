import Recipe from '../models/Recipe.js';

export async function listRecipes(req, res) {
  const { search, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
  return res.json({ count: recipes.length, recipes });
}

export async function getRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name email');
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
