import {
  PaymentMethodSchema,
  PaymentSchema,
  PaymentStatusSchema,
} from "../../../shared/src/dto/payment.schema";
import { z } from "zod";

export const FamilyMemberFiltersSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  name: z.string().trim().min(1).optional(),
  status: PaymentStatusSchema.or(z.literal("ALL")).or(z.literal("ISENTO")).optional(),
});

export const FamilyMemberPaymentSchema = PaymentSchema.extend({
  id: z.number().int().positive().optional(),
  atiradorId: z.number().int().positive().optional(),
  familyMemberId: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const FamilyMemberAtiradorSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  number: z.number().int().positive(),
  year: z.number().int().min(2000).max(2100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const FamilyMemberEntitySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  age: z.number().int().nonnegative(),
  atiradorId: z.number().int().positive(),
  paymentId: z.number().int().positive().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  payment: FamilyMemberPaymentSchema.nullable().optional(),
  atirador: FamilyMemberAtiradorSchema,
});

export const CreateFamilyMemberSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório"),
  age: z.number().int().min(0, "A idade não pode ser negativa"),
  atiradorId: z.number().int().positive("ID do atirador é obrigatório"),
  payment: z
    .object({
      status: PaymentStatusSchema,
      value: z.number().nonnegative().default(0),
      method: PaymentMethodSchema.default("CASH"),
    })
    .optional(),
});

export const UpdateFamilyMemberSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).optional(),
  age: z.number().int().min(0, "A idade não pode ser negativa").optional(),
  payment: z
    .object({
      status: PaymentStatusSchema,
      value: z.number().nonnegative().default(0),
      method: PaymentMethodSchema.default("CASH"),
    })
    .optional(),
});

export const DeleteFamilyMemberSchema = z.object({
  id: z.number().int().positive("ID inválido"),
});

export const FamilyMemberActorSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
  year: z.number().int().min(2000).max(2100),
});

export type FamilyMemberFilters = z.infer<typeof FamilyMemberFiltersSchema>;
export type FamilyMemberEntity = z.infer<typeof FamilyMemberEntitySchema>;
export type CreateFamilyMemberInput = z.infer<typeof CreateFamilyMemberSchema>;
export type UpdateFamilyMemberInput = z.infer<typeof UpdateFamilyMemberSchema>;
export type DeleteFamilyMemberInput = z.infer<typeof DeleteFamilyMemberSchema>;
export type FamilyMemberActor = z.infer<typeof FamilyMemberActorSchema>;
