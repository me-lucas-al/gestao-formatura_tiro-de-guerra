"use server";

import {
  CreateFamilyMemberSchema,
  DeleteFamilyMemberSchema,
  FamilyMemberActorSchema,
  FamilyMemberFiltersSchema,
  UpdateFamilyMemberSchema,
} from "../dto/family-member.schema";
import { FamilyMemberErrorSchema } from "../dto/family-member-result.schema";
import { familyMemberRepository } from "../repositories/actions/family-member.repository.actions";
import { FamilyMemberService } from "../services/family-member.service";

const createFamilyMemberService = () =>
  new FamilyMemberService(familyMemberRepository);

export const listFamilyMembersController = async (
  input: unknown,
  actorInput: unknown,
) => {
  const parsedActor = FamilyMemberActorSchema.safeParse(actorInput);

  if (!parsedActor.success) {
    return FamilyMemberErrorSchema.parse({
      success: false,
      error: "Acesso negado. Autenticação necessária.",
    });
  }

  const parsedFilters = FamilyMemberFiltersSchema.safeParse({
    ...(typeof input === "object" && input ? input : {}),
    year: parsedActor.data.year,
  });

  if (!parsedFilters.success) {
    const issue = parsedFilters.error.issues.at(0);

    return FamilyMemberErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createFamilyMemberService();

  return service.findMany(parsedFilters.data);
};

export const createFamilyMemberController = async (input: unknown) => {
  const parsedInput = CreateFamilyMemberSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return FamilyMemberErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createFamilyMemberService();

  return service.create(parsedInput.data);
};

export const updateFamilyMemberController = async (input: unknown) => {
  const parsedInput = UpdateFamilyMemberSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return FamilyMemberErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createFamilyMemberService();

  return service.update(parsedInput.data);
};

export const deleteFamilyMemberController = async (input: unknown) => {
  const parsedInput = DeleteFamilyMemberSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return FamilyMemberErrorSchema.parse({
      success: false,
      error: issue?.message ?? "ID inválido.",
    });
  }

  const service = createFamilyMemberService();

  return service.deleteWithPayment(parsedInput.data.id);
};
