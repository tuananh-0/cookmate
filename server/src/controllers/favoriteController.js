import Favorite from '../models/Favorite.js';
import Recipe from '../models/Recipe.js';

export async function listFavorites(req, res) {
  const favorites = await Favorite.find({ user: req.user._id })
    .populate('recipe')
    .sort({ createdAt: -1 });

  return res.json({ count: favorites.length, favorites });
}

export async function addFavorite(req, res) {
  const recipe = await Recipe.findById(req.params.recipeId);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const existingFavorite = await Favorite.findOne({ user: req.user._id, recipe: recipe._id });
  if (existingFavorite) return res.status(409).json({ message: 'Recipe is already a favorite' });

  const favorite = await Favorite.create({ user: req.user._id, recipe: recipe._id });
  return res.status(201).json({ favorite });
}

export async function removeFavorite(req, res) {
  const favorite = await Favorite.findOneAndDelete({
    user: req.user._id,
    recipe: req.params.recipeId,
  });

  if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
  return res.status(204).send();
}
