import mongoose from 'mongoose';

const itemDonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
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
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair'],
      default: 'Good',
    },
    intendedRecipients: {
      type: [String],
      default: ['Anyone in Need'],
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
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    pickupAvailability: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['available', 'claim_requested', 'claimed', 'pickup_scheduled', 'completed', 'cancelled'],
      default: 'available',
      index: true,
    },
    claimedByNgoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

itemDonationSchema.index({ status: 1, category: 1, city: 1 });

export const ItemDonation = mongoose.model('ItemDonation', itemDonationSchema);
