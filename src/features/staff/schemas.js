import { z } from 'zod';

// Staff Schemas
export const createStaffSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
  associationId: z.string().min(1, "Business Unit is required"),
  salary: z.coerce.number().min(0, "Salary cannot be negative")
});

export const updateStaffSchema = createStaffSchema.extend({
  status: z.enum(['active', 'inactive', 'on_leave'])
});

// User Account Schemas
export const createUserSchema = z.object({
  identifier: z.string().min(3, "Identifier (Email/Phone) is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(['super_admin', 'manager', 'staff', 'auditor'])
});

export const updateUserSchema = z.object({
  role: z.enum(['super_admin', 'manager', 'staff', 'auditor']),
  password: z.string().optional()
    .transform(val => val === '' ? undefined : val) // Treat empty string as undefined
    .refine(val => !val || val.length >= 8, { message: "Password must be at least 8 characters if provided" })
});
