import mongoose from 'mongoose';

const itemRequirementSchema = new mongoose.Schema(
  {
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Clothes', 'Books', 'Medicine', 'Toys', 'Electronics', 'Furniture', 'Other'],
      index: true,
    },
    quantityRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    quantityFulfilled: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      default: 'items',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    intendedRecipients: {
      type: [String],
      default: ['Anyone in Need'],
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    requiredBy: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'fulfilled', 'closed'],
      default: 'active',
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

itemRequirementSchema.index({ status: 1, category: 1, city: 1 });

export const ItemRequirement = mongoose.model('ItemRequirement', itemRequirementSchema);
