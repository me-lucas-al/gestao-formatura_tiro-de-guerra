import { z } from "zod";

export const AdminRoleSchema = z.enum(["ADMIN", "SUPER_ADMIN"]);

export const AuthAdminCredentialsSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),

  password: z.string().min(1),
  role: AdminRoleSchema,
  year: z.number().int().min(2000).max(2100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AuthAdminSessionSchema = AuthAdminCredentialsSchema.omit({
  password: true,
});

export type AuthAdminCredentials = z.infer<typeof AuthAdminCredentialsSchema>;
export type AuthAdminSession = z.infer<typeof AuthAdminSessionSchema>;
