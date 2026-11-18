import mongoose from 'mongoose';

const recipeRatingSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
  },
  { timestamps: true },
);

recipeRatingSchema.index({ recipe: 1, user: 1 }, { unique: true });

export default mongoose.model('RecipeRating', recipeRatingSchema);
