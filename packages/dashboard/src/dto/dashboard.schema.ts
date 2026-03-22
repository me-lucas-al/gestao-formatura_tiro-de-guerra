import { PaymentStatusSchema } from "../../../shared/src/dto/payment.schema";
import { z } from "zod";

export const DashboardActorSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
  year: z.number().int().min(2000).max(2100),
});

export const DashboardInputSchema = z.object({
  atirador_name: z.string().optional(),
  atirador_number: z.string().optional(),
  atirador_status: PaymentStatusSchema.or(z.literal("ALL")).optional(),
  family_name: z.string().optional(),
  family_status: PaymentStatusSchema.or(z.literal("ALL")).optional(),
});

export const DashboardAtiradorSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  number: z.number().int().positive(),
  year: z.number().int().min(2000).max(2100),
  payment: z
    .object({
      id: z.number().int().positive(),
      status: PaymentStatusSchema,
      value: z.number(),
      method: z.string(),
    })
    .nullable()
    .optional(),
  familyMembers: z.array(z.unknown()).optional(),
});

export const DashboardFamilyMemberSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  age: z.number().int().nonnegative(),
  atiradorId: z.number().int().positive(),
  payment: z
    .object({
      id: z.number().int().positive(),
      status: PaymentStatusSchema,
      value: z.number(),
      method: z.string(),
    })
    .nullable()
    .optional(),
});

export const DashboardDataSchema = z.object({
  atiradores: z.array(DashboardAtiradorSchema),
  familyMembers: z.array(DashboardFamilyMemberSchema),
  totalArrecadado: z.number().nonnegative(),
});

export type DashboardActor = z.infer<typeof DashboardActorSchema>;
export type DashboardInput = z.infer<typeof DashboardInputSchema>;
export type DashboardAtirador = z.infer<typeof DashboardAtiradorSchema>;
export type DashboardFamilyMember = z.infer<typeof DashboardFamilyMemberSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
