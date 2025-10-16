import { z } from "zod";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export const createFamilyMemberSchema = z.object({
  name: z.string(),
  age: z.number(),
  atiradorId: z.coerce.number().optional(),
  payment: z
    .object({
      status: z.enum(PaymentStatus).optional(),
      method: z.enum(PaymentMethod).optional(),
      value: z.number().optional(),
    })
    .optional(),
});
export type CreateFamilyMemberData = z.infer<typeof createFamilyMemberSchema>;

export const updateFamilyMemberSchema = createFamilyMemberSchema.extend({
  id: z.coerce.number().optional(),
});
export type UpdateFamilyMemberData = z.infer<typeof updateFamilyMemberSchema>;