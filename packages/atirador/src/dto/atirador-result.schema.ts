import { z } from "zod";
import { AtiradorEntitySchema } from "./atirador.schema";

export const AtiradorErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const AtiradorListSuccessSchema = z.object({
  success: z.literal(true),
  data: z.array(AtiradorEntitySchema),
});

export const AtiradorMutationSuccessSchema = z.object({
  success: z.literal(true),
  data: AtiradorEntitySchema,
});

export const AtiradorDeleteSuccessSchema = z.object({
  success: z.literal(true),
});

export const TotalArrecadadoSuccessSchema = z.object({
  success: z.literal(true),
  data: z.number().nonnegative(),
});

export type AtiradorErrorResult = z.infer<typeof AtiradorErrorSchema>;
export type AtiradorListSuccessResult = z.infer<
  typeof AtiradorListSuccessSchema
>;
export type AtiradorMutationSuccessResult = z.infer<
  typeof AtiradorMutationSuccessSchema
>;
export type AtiradorDeleteSuccessResult = z.infer<
  typeof AtiradorDeleteSuccessSchema
>;
export type TotalArrecadadoSuccessResult = z.infer<
  typeof TotalArrecadadoSuccessSchema
>;

export type ListAtiradorResult =
  | AtiradorListSuccessResult
  | AtiradorErrorResult;
export type AtiradorMutationResult =
  | AtiradorMutationSuccessResult
  | AtiradorErrorResult;
export type DeleteAtiradorResult =
  | AtiradorDeleteSuccessResult
  | AtiradorErrorResult;
export type GetTotalArrecadadoResult =
  | TotalArrecadadoSuccessResult
  | AtiradorErrorResult;
