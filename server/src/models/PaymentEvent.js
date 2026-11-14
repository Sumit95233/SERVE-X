import mongoose from 'mongoose';

const paymentEventSchema = new mongoose.Schema(
  {
    providerEventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      default: null,
      index: true,
    },
    paymentId: {
      type: String,
      default: null,
      index: true,
    },
    processingStatus: {
      type: String,
      enum: ['processed', 'ignored', 'failed'],
      default: 'processed',
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentEvent = mongoose.model('PaymentEvent', paymentEventSchema);
