import {
  PaymentMethodSchema,
  PaymentSchema,
  PaymentStatusSchema,
} from "../../../shared/src/dto/payment.schema";
import { z } from "zod";

export const AtiradorFiltersSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  name: z.string().trim().min(1).optional(),
  number: z.number().int().positive().optional(),
  status: PaymentStatusSchema.or(z.literal("ALL")).optional(),
});

export const AtiradorPaymentSchema = PaymentSchema.extend({
  id: z.number().int().positive().optional(),
  atiradorId: z.number().int().positive().optional(),
  familyMemberId: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const AtiradorFamilyMemberSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  age: z.number().int().nonnegative(),
  atiradorId: z.number().int().positive(),
  paymentId: z.number().int().positive().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  payment: AtiradorPaymentSchema.nullable().optional(),
});

export const AtiradorEntitySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  number: z.number().int().positive(),
  year: z.number().int().min(2000).max(2100),
  adminId: z.number().int().positive().nullable().optional(),
  paymentId: z.number().int().positive().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  payment: AtiradorPaymentSchema.nullable().optional(),
  familyMembers: z.array(AtiradorFamilyMemberSchema),
});

export const CreateAtiradorSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório"),
  number: z.number().int().positive("O número deve ser positivo"),
  year: z.number().int().min(2000).max(2100),
  adminId: z.number().int().positive().optional(),
  payment: z
    .object({
      status: PaymentStatusSchema,
      value: z.number().nonnegative().default(0),
      method: PaymentMethodSchema.default("CASH"),
    })
    .optional(),
});

export const UpdateAtiradorSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).optional(),
  number: z.number().int().positive().optional(),
  payment: z
    .object({
      status: PaymentStatusSchema,
      value: z.number().nonnegative().default(0),
      method: PaymentMethodSchema.default("CASH"),
    })
    .optional(),
});

export const DeleteAtiradorSchema = z.object({
  id: z.number().int().positive("ID inválido"),
});

export const AtiradorActorSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
  year: z.number().int().min(2000).max(2100),
});

export type AtiradorFilters = z.infer<typeof AtiradorFiltersSchema>;
export type AtiradorEntity = z.infer<typeof AtiradorEntitySchema>;
export type CreateAtiradorInput = z.infer<typeof CreateAtiradorSchema>;
export type UpdateAtiradorInput = z.infer<typeof UpdateAtiradorSchema>;
export type DeleteAtiradorInput = z.infer<typeof DeleteAtiradorSchema>;
export type AtiradorActor = z.infer<typeof AtiradorActorSchema>;
