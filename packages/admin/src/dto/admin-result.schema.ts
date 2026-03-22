import { z } from "zod";
import { AdminEntitySchema } from "./admin.schema";

export const AdminErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const AdminCreateSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: AdminEntitySchema,
});

export const AdminChangePasswordSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export const AdminDeleteSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export const AdminListSuccessSchema = z.object({
  success: z.literal(true),
  data: z.array(AdminEntitySchema),
});

export type AdminErrorResult = z.infer<typeof AdminErrorSchema>;
export type AdminCreateSuccessResult = z.infer<typeof AdminCreateSuccessSchema>;
export type AdminChangePasswordSuccessResult = z.infer<
  typeof AdminChangePasswordSuccessSchema
>;
export type AdminDeleteSuccessResult = z.infer<typeof AdminDeleteSuccessSchema>;
export type AdminListSuccessResult = z.infer<typeof AdminListSuccessSchema>;

export type CreateAdminResult = AdminCreateSuccessResult | AdminErrorResult;
export type ChangePasswordResult =
  | AdminChangePasswordSuccessResult
  | AdminErrorResult;
export type DeleteAdminResult = AdminDeleteSuccessResult | AdminErrorResult;
export type ListAdminResult = AdminListSuccessResult | AdminErrorResult;
