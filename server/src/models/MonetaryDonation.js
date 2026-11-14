import mongoose from 'mongoose';

const monetaryDonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorEmail: {
      type: String,
      required: true,
      trim: true,
    },
    donorPhone: {
      type: String,
      default: '',
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true,
      index: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['initiated', 'pending', 'successful', 'failed', 'refunded'],
      default: 'initiated',
      index: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    donorMessage: {
      type: String,
      default: '',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    refundedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    emailDeliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped', 'simulated'],
      default: 'pending',
      index: true,
    },
    emailDeliveryId: {
      type: String,
      default: null,
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
    emailError: {
      type: String,
      default: null,
    },
    receiptPdfPath: {
      type: String,
      default: null,
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

monetaryDonationSchema.index({ donorId: 1, createdAt: -1 });
monetaryDonationSchema.index({ paymentStatus: 1, createdAt: -1 });
monetaryDonationSchema.index({ paymentStatus: 1, donorId: 1 });

export const MonetaryDonation = mongoose.model('MonetaryDonation', monetaryDonationSchema);
