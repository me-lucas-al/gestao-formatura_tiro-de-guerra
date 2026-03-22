import { z } from "zod";

export const IdentifierSchema = z.number().int().positive();
export const PersonNameSchema = z.string().trim().min(1).max(120);
export const YearSchema = z.number().int().min(2000).max(2100);

export type Identifier = z.infer<typeof IdentifierSchema>;
export type PersonName = z.infer<typeof PersonNameSchema>;
export type Year = z.infer<typeof YearSchema>;
