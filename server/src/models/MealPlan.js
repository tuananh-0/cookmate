import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    note: { type: String, trim: true, maxlength: 200, default: '' },
  },
  { timestamps: true },
);

mealPlanSchema.index({ user: 1, date: 1, mealType: 1 }, { unique: true });

export default mongoose.model('MealPlan', mealPlanSchema);
