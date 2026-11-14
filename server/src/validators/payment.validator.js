import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z
    .object({
      campaignId: z.string().optional(),
      ngoId: z.string().optional(),
      amount: z.coerce.number().min(10, 'Donation amount must be at least ₹10'),
      donorName: z.string().min(2, 'Donor name is required'),
      donorEmail: z.string().email('Valid email is required'),
      donorPhone: z.string().optional().default(''),
      donorMessage: z.string().optional().default(''),
      isAnonymous: z.boolean().optional().default(false),
    })
    .refine((data) => data.campaignId || data.ngoId, {
      message: 'Either campaignId or ngoId is required',
      path: ['ngoId'],
    }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1, 'Order ID is required'),
    razorpayPaymentId: z.string().min(1, 'Payment ID is required'),
    razorpaySignature: z.string().min(1, 'Payment signature is required'),
  }),
});
