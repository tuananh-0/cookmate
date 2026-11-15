import mongoose from 'mongoose';

const shoppingItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    checked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

shoppingItemSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('ShoppingItem', shoppingItemSchema);
