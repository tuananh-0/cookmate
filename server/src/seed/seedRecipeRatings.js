import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import RecipeRating from '../models/RecipeRating.js';
import { publicRecipeFilter } from '../utils/recipeVisibility.js';

const mongoUri = process.env.MONGO_URI;
const seedEmails = [...new Set((process.env.SEED_RATING_USERS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean))];

if (!mongoUri) {
  throw new Error('Set MONGO_URI to the database that should receive the demo ratings.');
}

if (!seedEmails.length) {
  throw new Error('Set SEED_RATING_USERS to comma-separated emails of existing demo accounts.');
}

await mongoose.connect(mongoUri);

try {
  const users = await User.find({ email: { $in: seedEmails } }).select('_id email');
  const foundEmails = new Set(users.map((user) => user.email));
  const missingEmails = seedEmails.filter((email) => !foundEmails.has(email));
  if (missingEmails.length) {
    throw new Error(`Create these demo accounts in the target database first: ${missingEmails.join(', ')}`);
  }

  const recipes = await Recipe.find(publicRecipeFilter).select('_id createdBy title').sort({ title: 1 });
  if (!recipes.length) throw new Error('No published recipes found in the target database.');

  const operations = [];
  for (const [userIndex, user] of users.entries()) {
    for (const [recipeIndex, recipe] of recipes.entries()) {
      if (String(recipe.createdBy) === String(user._id)) continue;

      // Deterministic 3–5 star demo ratings; never overwrite a user's existing rating.
      const rating = 3 + ((userIndex * 2 + recipeIndex) % 3);
      operations.push({
        updateOne: {
          filter: { recipe: recipe._id, user: user._id },
          update: { $setOnInsert: { recipe: recipe._id, user: user._id, rating } },
          upsert: true,
        },
      });
    }
  }

  if (!operations.length) throw new Error('No ratings can be seeded: demo users authored every published recipe.');

  const result = await RecipeRating.bulkWrite(operations, { ordered: false });
  console.log(`Seeded ${result.upsertedCount} demo ratings across ${recipes.length} published recipes for ${users.length} users.`);
  console.log('Existing ratings were preserved. Demo ratings are synthetic and should not be treated as real user feedback.');
} finally {
  await mongoose.disconnect();
}
