"use server";

import {
  AtiradorActorSchema,
  AtiradorFiltersSchema,
  CreateAtiradorSchema,
  DeleteAtiradorSchema,
  UpdateAtiradorSchema,
} from "../dto/atirador.schema";
import { AtiradorErrorSchema } from "../dto/atirador-result.schema";
import { atiradorRepository } from "../repositories/actions/atirador.repository.actions";
import { AtiradorService } from "../services/atirador.service";

const createAtiradorService = () => new AtiradorService(atiradorRepository);

export const listAtiradoresController = async (
  input: unknown,
  actorInput: unknown,
) => {
  const parsedActor = AtiradorActorSchema.safeParse(actorInput);

  if (!parsedActor.success) {
    return AtiradorErrorSchema.parse({
      success: false,
      error: "Acesso negado. Autenticação necessária.",
    });
  }

  const parsedFilters = AtiradorFiltersSchema.safeParse({
    ...(typeof input === "object" && input ? input : {}),
    year: parsedActor.data.year,
  });

  if (!parsedFilters.success) {
    const issue = parsedFilters.error.issues.at(0);

    return AtiradorErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createAtiradorService();

  return service.findMany(parsedFilters.data);
};

export const createAtiradorController = async (
  input: unknown,
  actorInput: unknown,
) => {
  const parsedActor = AtiradorActorSchema.safeParse(actorInput);

  if (!parsedActor.success) {
    return AtiradorErrorSchema.parse({
      success: false,
      error: "Acesso negado. Autenticação necessária.",
    });
  }

  const parsedInput = CreateAtiradorSchema.safeParse({
    ...(typeof input === "object" && input ? input : {}),
    year: parsedActor.data.year,
    adminId: parsedActor.data.id,
  });

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return AtiradorErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createAtiradorService();

  return service.create(parsedInput.data);
};

export const updateAtiradorController = async (input: unknown) => {
  const parsedInput = UpdateAtiradorSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return AtiradorErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createAtiradorService();

  return service.update(parsedInput.data);
};

export const deleteAtiradorController = async (input: unknown) => {
  const parsedInput = DeleteAtiradorSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return AtiradorErrorSchema.parse({
      success: false,
      error: issue?.message ?? "ID inválido.",
    });
  }

  const service = createAtiradorService();

  return service.deleteWithRelations(parsedInput.data.id);
};

export const getTotalArrecadadoController = async (actorInput: unknown) => {
  const parsedActor = AtiradorActorSchema.safeParse(actorInput);

  if (!parsedActor.success) {
    return AtiradorErrorSchema.parse({
      success: false,
      error: "Acesso negado. Autenticação necessária.",
    });
  }

  const service = createAtiradorService();

  return service.getTotalArrecadado(parsedActor.data.year);
};
