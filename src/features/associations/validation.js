import { z } from 'zod';

export const createAssociationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(['project', 'department', 'fleet'], {
    errorMap: () => ({ message: "Please select a valid unit type" })
  })
});
