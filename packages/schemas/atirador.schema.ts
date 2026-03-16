import { z } from "zod";
import { paymentSchema } from "./payment.schema";

export const createAtiradorSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  number: z.number().int().positive("O número deve ser positivo"),
  payment: paymentSchema.optional(),
});

export const updateAtiradorSchema = createAtiradorSchema.partial();

export const deleteAtiradorSchema = z.object({
  id: z.number().int().positive("ID inválido"),
});

export const changeAtiradorStatusSchema = z.object({
  payment: paymentSchema,
});

export type CreateAtiradorData = z.infer<typeof createAtiradorSchema>;
export type UpdateAtiradorData = z.infer<typeof updateAtiradorSchema>;
export type DeleteAtiradorData = z.infer<typeof deleteAtiradorSchema>;
export type ChangeAtiradorStatusData = z.infer<
  typeof changeAtiradorStatusSchema
>;
