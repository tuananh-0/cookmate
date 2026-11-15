import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  { name: { type: String, required: true, trim: true }, quantity: { type: String, required: true, trim: true } },
  { _id: false },
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    ingredients: { type: [ingredientSchema], required: true, validate: (items) => items.length > 0 },
    instructions: { type: [String], required: true, validate: (items) => items.length > 0 },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true, default: '' },
    prepTime: { type: Number, min: 0, default: 0 },
    cookTime: { type: Number, min: 0, default: 0 },
    servings: { type: Number, min: 1, default: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

recipeSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model('Recipe', recipeSchema);
