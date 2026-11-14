import { z } from 'zod';

export const createRequirementSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    category: z.enum(['Food', 'Clothes', 'Books', 'Medicine', 'Toys', 'Electronics', 'Furniture', 'Other']),
    quantityRequired: z.coerce.number().positive('Quantity required must be positive'),
    unit: z.string().optional().default('items'),
    description: z.string().min(10, 'Description must be meaningful'),
    intendedRecipients: z.array(z.string()).min(1, 'Specify intended recipients'),
    urgency: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    requiredBy: z.string().optional().nullable(),
    images: z.array(z.string()).optional().default([]),
  }),
});
