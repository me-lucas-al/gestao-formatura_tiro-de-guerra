import { z } from "zod";
import { paymentSchema } from "./payment.schema";

export const createFamilyMemberSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  age: z.number().int().min(0, "A idade não pode ser negativa"),
  atiradorId: z.number().int().positive("ID do atirador é obrigatório"),
  payment: paymentSchema.optional(),
});

export const updateFamilyMemberSchema = z.object({
  name: z.string().optional(),
  age: z.number().int().min(0, "A idade não pode ser negativa").optional(),
  payment: paymentSchema.optional(),
});

export const changeFamilyMemberStatusSchema = z.object({
  payment: paymentSchema,
});

export const deleteFamilyMemberSchema = z.object({
  id: z.number().int().positive("ID inválido"),
});

export type CreateFamilyMemberData = z.infer<typeof createFamilyMemberSchema>;
export type UpdateFamilyMemberData = z.infer<typeof updateFamilyMemberSchema>;
export type ChangeFamilyMemberStatusData = z.infer<
  typeof changeFamilyMemberStatusSchema
>;
export type DeleteFamilyMemberData = z.infer<typeof deleteFamilyMemberSchema>;
