"use server";

import { prismaClient } from "@gestao_formatura/shared";
import {
  AtiradorEntitySchema,
  type AtiradorFilters,
  type CreateAtiradorInput,
  type UpdateAtiradorInput,
} from "../../dto/atirador.schema";
import type { IAtiradorRepository } from "../interfaces/atirador.repository.interface";

const includeRelations = {
  payment: true,
  familyMembers: {
    include: {
      payment: true,
    },
  },
} as const;

export const findMany: IAtiradorRepository["findMany"] = async (
  filters: AtiradorFilters,
) => {
  const where: Record<string, unknown> = { year: filters.year };

  if (filters.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }

  if (filters.number !== undefined) {
    where.number = filters.number;
  }

  if (filters.status && filters.status !== "ALL") {
    where.payment = { status: filters.status };
  }

  const atiradores = await prismaClient.atirador.findMany({
    where,
    orderBy: { number: "asc" },
    include: includeRelations,
  });

  return atiradores.map((atirador: unknown) =>
    AtiradorEntitySchema.parse(atirador),
  );
};

export const findByNumber: IAtiradorRepository["findByNumber"] = async (
  number,
  year,
) => {
  const atirador = await prismaClient.atirador.findFirst({
    where: { number, year },
    include: includeRelations,
  });

  if (!atirador) {
    return null;
  }

  return AtiradorEntitySchema.parse(atirador);
};

export const create: IAtiradorRepository["create"] = async (
  input: CreateAtiradorInput,
) => {
  const atirador = await prismaClient.atirador.create({
    data: {
      name: input.name,
      number: input.number,
      year: input.year,
      adminId: input.adminId,
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

  return AtiradorEntitySchema.parse(atirador);
};

export const update: IAtiradorRepository["update"] = async (
  input: UpdateAtiradorInput,
) => {
  const updateData: Record<string, unknown> = {};

  if (input.name) {
    updateData.name = input.name;
  }

  if (input.number !== undefined) {
    updateData.number = input.number;
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

  const atirador = await prismaClient.atirador.update({
    where: { id: input.id },
    data: updateData,
    include: includeRelations,
  });

  return AtiradorEntitySchema.parse(atirador);
};

export const findByIdWithRelations: IAtiradorRepository["findByIdWithRelations"] =
  async (id) => {
    const atirador = await prismaClient.atirador.findUnique({
      where: { id },
      include: includeRelations,
    });

    if (!atirador) {
      return null;
    }

    return AtiradorEntitySchema.parse(atirador);
  };

export const deleteFamilyMemberPaymentById: IAtiradorRepository["deleteFamilyMemberPaymentById"] =
  async (paymentId) => {
    await prismaClient.payment.delete({ where: { id: paymentId } });
  };

export const deleteFamilyMemberById: IAtiradorRepository["deleteFamilyMemberById"] =
  async (familyMemberId) => {
    await prismaClient.familyMember.delete({ where: { id: familyMemberId } });
  };

export const deletePaymentById: IAtiradorRepository["deletePaymentById"] =
  async (paymentId) => {
    await prismaClient.payment.delete({ where: { id: paymentId } });
  };

export const deleteAtiradorById: IAtiradorRepository["deleteAtiradorById"] =
  async (id) => {
    await prismaClient.atirador.delete({ where: { id } });
  };

export const sumPaidAtiradorPaymentsByYear: IAtiradorRepository["sumPaidAtiradorPaymentsByYear"] =
  async (year) => {
    const aggregate = await prismaClient.payment.aggregate({
      _sum: { value: true },
      where: {
        status: { in: ["PAID", "FIRST_INSTALLMENT_PAID"] },
        atirador: { year },
      },
    });

    return aggregate._sum.value ?? 0;
  };

export const sumPaidFamilyMemberPaymentsByYear: IAtiradorRepository["sumPaidFamilyMemberPaymentsByYear"] =
  async (year) => {
    const aggregate = await prismaClient.payment.aggregate({
      _sum: { value: true },
      where: {
        status: { in: ["PAID", "FIRST_INSTALLMENT_PAID"] },
        familyMember: { atirador: { year } },
      },
    });

    return aggregate._sum.value ?? 0;
  };

export const atiradorRepository: IAtiradorRepository = {
  findMany,
  findByNumber,
  create,
  update,
  findByIdWithRelations,
  deleteFamilyMemberPaymentById,
  deleteFamilyMemberById,
  deletePaymentById,
  deleteAtiradorById,
  sumPaidAtiradorPaymentsByYear,
  sumPaidFamilyMemberPaymentsByYear,
};
