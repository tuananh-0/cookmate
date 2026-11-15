import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import { sampleRecipes } from './recipes.js';

const mongoUri = process.env.MONGO_URI;
const seedUserEmail = process.env.SEED_USER_EMAIL?.trim().toLowerCase();

if (!mongoUri) {
  throw new Error('Set MONGO_URI to the database that should receive the sample recipes.');
}

if (!seedUserEmail) {
  throw new Error('Set SEED_USER_EMAIL to the existing account that should own the sample recipes.');
}

await mongoose.connect(mongoUri);

try {
  const user = await User.findOne({ email: seedUserEmail });
  if (!user) {
    throw new Error(`No user found with email ${seedUserEmail}. Create that account in the target database first.`);
  }

  for (const recipe of sampleRecipes) {
    await Recipe.updateOne(
      { title: recipe.title },
      { $set: { ...recipe, createdBy: user._id } },
      { upsert: true },
    );
  }

  console.log(`Seeded ${sampleRecipes.length} recipes for ${user.email}.`);
} finally {
  await mongoose.disconnect();
}
