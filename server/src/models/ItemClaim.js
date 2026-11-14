import mongoose from 'mongoose';

const itemClaimSchema = new mongoose.Schema(
  {
    itemDonationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemDonation',
      required: true,
      index: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true,
      index: true,
    },
    requestedQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'pickup_scheduled', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    pickupSchedule: {
      date: { type: Date, default: null },
      timeSlot: { type: String, default: '' },
      contactPhone: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    receivedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const ItemClaim = mongoose.model('ItemClaim', itemClaimSchema);
