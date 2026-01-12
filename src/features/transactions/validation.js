import { z } from 'zod';

export const createTransactionSchema = z.object({
  associationId: z.string().min(1, "Business Unit is required"),
  type: z.enum(['income', 'expense'], { required_error: "Transaction type is required" }),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  is_htmx: z.string().optional()
});
