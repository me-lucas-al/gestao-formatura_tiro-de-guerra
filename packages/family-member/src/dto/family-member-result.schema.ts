import { z } from "zod";
import { FamilyMemberEntitySchema } from "./family-member.schema";

export const FamilyMemberErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const FamilyMemberListSuccessSchema = z.object({
  success: z.literal(true),
  data: z.array(FamilyMemberEntitySchema),
});

export const FamilyMemberMutationSuccessSchema = z.object({
  success: z.literal(true),
  data: FamilyMemberEntitySchema,
});

export const FamilyMemberDeleteSuccessSchema = z.object({
  success: z.literal(true),
});

export type FamilyMemberErrorResult = z.infer<typeof FamilyMemberErrorSchema>;
export type FamilyMemberListSuccessResult = z.infer<
  typeof FamilyMemberListSuccessSchema
>;
export type FamilyMemberMutationSuccessResult = z.infer<
  typeof FamilyMemberMutationSuccessSchema
>;
export type FamilyMemberDeleteSuccessResult = z.infer<
  typeof FamilyMemberDeleteSuccessSchema
>;

export type ListFamilyMemberResult =
  | FamilyMemberListSuccessResult
  | FamilyMemberErrorResult;
export type FamilyMemberMutationResult =
  | FamilyMemberMutationSuccessResult
  | FamilyMemberErrorResult;
export type DeleteFamilyMemberResult =
  | FamilyMemberDeleteSuccessResult
  | FamilyMemberErrorResult;
