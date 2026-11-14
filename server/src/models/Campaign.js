import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    causeCategory: {
      type: String,
      required: true,
      index: true,
    },
    goalAmount: {
      type: Number,
      required: true,
      min: 100,
    },
    amountRaised: {
      type: Number,
      default: 0,
      min: 0,
    },
    donorCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    beneficiaryDescription: {
      type: String,
      required: true,
    },
    fundUsagePlan: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'active', 'paused', 'completed', 'rejected'],
      default: 'pending_review',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.index({ status: 1, ngoId: 1, endDate: 1 });

export const Campaign = mongoose.model('Campaign', campaignSchema);
