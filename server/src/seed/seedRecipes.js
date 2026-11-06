import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import { sampleRecipes } from './recipes.js';

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cookmate';
await mongoose.connect(mongoUri);

const user = await User.findOne();
if (!user) throw new Error('Create at least one user before seeding recipes.');

for (const recipe of sampleRecipes) {
  await Recipe.updateOne(
    { title: recipe.title },
    { $set: { ...recipe, createdBy: user._id } },
    { upsert: true },
  );
}

console.log(`Seeded ${sampleRecipes.length} recipes.`);
await mongoose.disconnect();
