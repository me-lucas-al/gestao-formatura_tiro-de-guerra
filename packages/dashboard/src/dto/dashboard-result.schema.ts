import { z } from "zod";
import { DashboardDataSchema } from "./dashboard.schema";

export const DashboardErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const DashboardSuccessSchema = z.object({
  success: z.literal(true),
  data: DashboardDataSchema,
});

export type DashboardErrorResult = z.infer<typeof DashboardErrorSchema>;
export type DashboardSuccessResult = z.infer<typeof DashboardSuccessSchema>;
export type DashboardResult = DashboardSuccessResult | DashboardErrorResult;
