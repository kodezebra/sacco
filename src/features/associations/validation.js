import { z } from 'zod';

export const createAssociationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(['project', 'department']).default('project'),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
});

export const updateAssociationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(['project', 'department']),
  status: z.enum(['active', 'inactive']),
});
