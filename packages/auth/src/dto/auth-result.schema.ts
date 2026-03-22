import { z } from "zod";
import { AuthAdminSessionSchema } from "./auth-admin.schema";

export const AuthErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  status: z.number().int().optional(),
});

export const LoginSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export const SessionSuccessSchema = z.object({
  success: z.literal(true),
  data: AuthAdminSessionSchema,
});

export const LogoutSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type AuthErrorResult = z.infer<typeof AuthErrorSchema>;
export type LoginSuccessResult = z.infer<typeof LoginSuccessSchema>;
export type SessionSuccessResult = z.infer<typeof SessionSuccessSchema>;
export type LogoutSuccessResult = z.infer<typeof LogoutSuccessSchema>;

export type LoginResult = LoginSuccessResult | AuthErrorResult;
export type SessionResult = SessionSuccessResult | AuthErrorResult;
export type LogoutResult = LogoutSuccessResult;
