import { z } from 'zod';

export const createItemDonationSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required (at least 3 characters)'),
    category: z.enum(['Food', 'Clothes', 'Books', 'Medicine', 'Toys', 'Electronics', 'Furniture', 'Other']),
    quantity: z.coerce.number().positive('Quantity must be greater than zero'),
    unit: z.string().optional().default('items'),
    description: z.string().min(10, 'Description must be meaningful (at least 10 characters)'),
    condition: z.enum(['New', 'Like New', 'Good', 'Fair']).default('Good'),
    intendedRecipients: z.array(z.string()).min(1, 'Specify at least one intended recipient group'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pickupAddress: z.string().min(5, 'Pickup address is required'),
    pickupAvailability: z.string().min(3, 'Pickup availability details required'),
    images: z.array(z.string()).optional().default([]),
  }),
});

export const claimItemSchema = z.object({
  body: z.object({
    requestedQuantity: z.coerce.number().positive('Requested quantity must be at least 1'),
    notes: z.string().optional().default(''),
    pickupSchedule: z.object({
      date: z.string().optional(),
      timeSlot: z.string().optional(),
      contactPhone: z.string().optional(),
      notes: z.string().optional(),
    }).optional(),
  }),
});
