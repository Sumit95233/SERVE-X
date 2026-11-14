import { z } from 'zod';

export const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Campaign title must be at least 5 characters'),
    description: z.string().min(20, 'Campaign description must be at least 20 characters'),
    causeCategory: z.string().min(2, 'Cause category is required'),
    goalAmount: z.coerce.number().positive('Goal amount must be greater than zero'),
    city: z.string().min(2, 'City is required'),
    startDate: z.string().optional(),
    endDate: z.string().min(1, 'Campaign deadline date is required'),
    beneficiaryDescription: z.string().min(10, 'Beneficiary description is required'),
    fundUsagePlan: z.string().min(10, 'Fund usage breakdown plan is required'),
    images: z.array(z.string()).optional().default([]),
  }),
});
