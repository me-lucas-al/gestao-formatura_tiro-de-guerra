"use server";

import { prismaClient } from "@gestao_formatura/shared";
import {
  FamilyMemberEntitySchema,
  type CreateFamilyMemberInput,
  type UpdateFamilyMemberInput,
} from "../../dto/family-member.schema";
import type {
  FamilyMemberRepositoryFilters,
  IFamilyMemberRepository,
} from "../interfaces/family-member.repository.interface";

const includeRelations = {
  payment: true,
  atirador: true,
} as const;

export const findMany: IFamilyMemberRepository["findMany"] = async (
  filters: FamilyMemberRepositoryFilters,
) => {
  const where: Record<string, unknown> = {
    atirador: { year: filters.year },
  };

  if (filters.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }

  if (filters.minimumAge !== undefined || filters.maximumAge !== undefined) {
    where.age = {
      ...(filters.minimumAge !== undefined ? { gte: filters.minimumAge } : {}),
      ...(filters.maximumAge !== undefined ? { lte: filters.maximumAge } : {}),
    };
  }

  if (filters.paymentStatus && filters.includeNullPayment) {
    where.OR = [
      { payment: null },
      { payment: { status: filters.paymentStatus } },
    ];
  }

  if (filters.paymentStatus && !filters.includeNullPayment) {
    where.payment = { status: filters.paymentStatus };
  }

  const familyMembers = await prismaClient.familyMember.findMany({
    where,
    orderBy: { name: "asc" },
    include: includeRelations,
  });

  return familyMembers.map((familyMember: unknown) =>
    FamilyMemberEntitySchema.parse(familyMember),
  );
};

export const create: IFamilyMemberRepository["create"] = async (
  input: CreateFamilyMemberInput,
) => {
  const familyMember = await prismaClient.familyMember.create({
    data: {
      name: input.name,
      age: input.age,
      atirador: { connect: { id: input.atiradorId } },
      payment: input.payment
        ? {
            create: {
              status: input.payment.status,
              value: input.payment.value,
              method: input.payment.method,
            },
          }
        : undefined,
    },
    include: includeRelations,
  });

  return FamilyMemberEntitySchema.parse(familyMember);
};

export const update: IFamilyMemberRepository["update"] = async (
  input: UpdateFamilyMemberInput,
) => {
  const updateData: Record<string, unknown> = {};

  if (input.name) {
    updateData.name = input.name;
  }

  if (input.age !== undefined) {
    updateData.age = input.age;
  }

  if (input.payment) {
    updateData.payment = {
      upsert: {
        create: {
          status: input.payment.status,
          value: input.payment.value,
          method: input.payment.method,
        },
        update: {
          status: input.payment.status,
          value: input.payment.value,
          method: input.payment.method,
        },
      },
    };
  }

  const familyMember = await prismaClient.familyMember.update({
    where: { id: input.id },
    data: updateData,
    include: includeRelations,
  });

  return FamilyMemberEntitySchema.parse(familyMember);
};

export const findByIdWithPayment: IFamilyMemberRepository["findByIdWithPayment"] =
  async (id) => {
    const familyMember = await prismaClient.familyMember.findUnique({
      where: { id },
      include: includeRelations,
    });

    if (!familyMember) {
      return null;
    }

    return FamilyMemberEntitySchema.parse(familyMember);
  };

export const deletePaymentById: IFamilyMemberRepository["deletePaymentById"] =
  async (paymentId) => {
    await prismaClient.payment.delete({ where: { id: paymentId } });
  };

export const deleteById: IFamilyMemberRepository["deleteById"] = async (id) => {
  await prismaClient.familyMember.delete({ where: { id } });
};

export const familyMemberRepository: IFamilyMemberRepository = {
  findMany,
  create,
  update,
  findByIdWithPayment,
  deletePaymentById,
  deleteById,
};
