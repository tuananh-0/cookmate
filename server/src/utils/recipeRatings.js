import RecipeRating from '../models/RecipeRating.js';

const PRIOR_AVERAGE = 3.5;
const PRIOR_COUNT = 5;

export async function addRatingSummaries(recipes, sortByRating = false) {
  if (!recipes.length) return recipes;

  const summaries = await RecipeRating.aggregate([
    { $match: { recipe: { $in: recipes.map((recipe) => recipe._id) } } },
    { $group: { _id: '$recipe', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const byRecipeId = new Map(summaries.map((summary) => [String(summary._id), summary]));
  const decorated = recipes.map((recipe) => {
    const summary = byRecipeId.get(String(recipe._id));
    const average = summary?.average || 0;
    const count = summary?.count || 0;
    const score = (average * count + PRIOR_AVERAGE * PRIOR_COUNT) / (count + PRIOR_COUNT);
    return {
      ...(recipe.toObject ? recipe.toObject() : recipe),
      ratingAverage: Number(average.toFixed(1)),
      ratingCount: count,
      _ratingScore: score,
    };
  });

  if (sortByRating) {
    decorated.sort((first, second) => second._ratingScore - first._ratingScore
      || second.ratingCount - first.ratingCount
      || first.title.localeCompare(second.title, 'vi'));
  }

  return decorated.map(({ _ratingScore, ...recipe }) => recipe);
}
