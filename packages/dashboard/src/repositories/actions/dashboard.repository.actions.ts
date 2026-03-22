"use server";

import { prismaClient } from "@gestao_formatura/shared";
import {
  DashboardAtiradorSchema,
  DashboardFamilyMemberSchema,
} from "../../dto/dashboard.schema";
import type {
  DashboardAtiradorFilters,
  DashboardFamilyMemberFilters,
  IDashboardRepository,
} from "../interfaces/dashboard.repository.interface";

const atiradorIncludeRelations = {
  payment: true,
  familyMembers: {
    include: {
      payment: true,
    },
  },
} as const;

export const getAtiradores: IDashboardRepository["getAtiradores"] = async (
  filters: DashboardAtiradorFilters,
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
    include: atiradorIncludeRelations,
  });

  return atiradores.map((atirador: unknown) =>
    DashboardAtiradorSchema.parse(atirador),
  );
};

export const getFamilyMembers: IDashboardRepository["getFamilyMembers"] =
  async (filters: DashboardFamilyMemberFilters) => {
    const where: Record<string, unknown> = {
      atirador: { year: filters.year },
    };

    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }

    if (filters.status && filters.status !== "ALL") {
      if (filters.status === "ISENTO") {
        where.age = { lt: 6 };
      }

      if (filters.status === "PENDING") {
        where.age = { gte: 6 };
        where.OR = [{ payment: null }, { payment: { status: "PENDING" } }];
      }

      if (filters.status !== "ISENTO" && filters.status !== "PENDING") {
        where.payment = { status: filters.status };
      }
    }

    const familyMembers = await prismaClient.familyMember.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        payment: true,
        atirador: true,
      },
    });

    return familyMembers.map((familyMember: unknown) =>
      DashboardFamilyMemberSchema.parse(familyMember),
    );
  };

export const getTotalArrecadado: IDashboardRepository["getTotalArrecadado"] =
  async (year) => {
    const paidStatuses: Array<"PAID" | "FIRST_INSTALLMENT_PAID"> = [
      "PAID",
      "FIRST_INSTALLMENT_PAID",
    ];

    const atiradorPayments = await prismaClient.payment.aggregate({
      _sum: { value: true },
      where: {
        status: { in: paidStatuses },
        atirador: { year },
      },
    });

    const familyPayments = await prismaClient.payment.aggregate({
      _sum: { value: true },
      where: {
        status: { in: paidStatuses },
        familyMember: { atirador: { year } },
      },
    });

    return (
      (atiradorPayments._sum.value ?? 0) + (familyPayments._sum.value ?? 0)
    );
  };

export const dashboardRepository: IDashboardRepository = {
  getAtiradores,
  getFamilyMembers,
  getTotalArrecadado,
};
