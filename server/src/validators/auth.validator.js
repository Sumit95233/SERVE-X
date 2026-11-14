import { z } from 'zod';

export const donorRegisterSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address').toLowerCase(),
    phone: z.string().min(10, 'Valid phone number required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }),
});

export const ngoRegisterSchema = z.object({
  body: z.object({
    organizationName: z.string().min(3, 'Organization name must be at least 3 characters'),
    registrationNumber: z.string().min(3, 'Registration number is required'),
    contactPerson: z.string().min(2, 'Contact person name is required'),
    email: z.string().email('Invalid email address').toLowerCase(),
    phone: z.string().min(10, 'Valid phone number required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    address: z.string().min(5, 'Registered address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(5, 'Valid pincode is required'),
    causeCategories: z.array(z.string()).min(1, 'Select at least one cause category'),
    description: z.string().min(20, 'Please provide an informative description (minimum 20 chars)'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['donor', 'ngo', 'admin']).optional(),
  }),
});

export const googleLoginSchema = z.object({
  body: z.object({
    credential: z.string().min(1, 'Google credential is required'),
    role: z.enum(['donor', 'ngo', 'admin']).optional(),
    isSimulated: z.boolean().nullable().optional(),
    simulatedUser: z
      .object({
        fullName: z.string().optional(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        avatar: z.string().optional(),
        picture: z.string().optional(),
        googleId: z.string().optional(),
      })
      .passthrough()
      .nullable()
      .optional(),
  }),
});

