import { z } from 'zod';

export const createMemberSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().min(10, "Valid phone number is required").optional().or(z.literal('')),
  address: z.string().optional(),
  nextOfKinName: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
});

export const updateMemberSchema = createMemberSchema.extend({
  status: z.enum(['active', 'inactive']).optional(),
});

export const memberTransactionSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export const memberLoanSchema = z.object({
  principal: z.coerce.number().min(1000, "Principal must be at least 1,000"),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative"),
  durationMonths: z.coerce.number().min(1, "Duration must be at least 1 month"),
  issuedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});
