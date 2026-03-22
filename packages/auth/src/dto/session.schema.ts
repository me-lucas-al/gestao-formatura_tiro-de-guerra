import { z } from "zod";
import { AdminRoleSchema } from "./auth-admin.schema";

export const SessionTokenPayloadSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  role: AdminRoleSchema,
  year: z.number().int().min(2000).max(2100),
});

export type SessionTokenPayload = z.infer<typeof SessionTokenPayloadSchema>;
