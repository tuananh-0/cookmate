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
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    reviewNote: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
);

recipeSchema.index({ createdBy: 1, createdAt: -1 });

recipeSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model('Recipe', recipeSchema);
