import { db } from "@/lib/prisma";
import type { FamilyMemberWithRelations } from "@packages/types";
import type { PaymentStatus, PaymentMethod } from "@prisma/client";

export type FamilyMemberFilters = {
  year: number;
  name?: string;
  status?: string;
};

const includeRelations = {
  payment: true,
  atirador: true,
} as const;

export const FamilyMemberService = {
  async findMany(
    filters: FamilyMemberFilters,
  ): Promise<FamilyMemberWithRelations[]> {
    const where: Record<string, unknown> = {
      atirador: { year: filters.year },
    };

    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }

    if (filters.status && filters.status !== "ALL") {
      if (filters.status === "ISENTO") {
        where.age = { lt: 6 };
      } else if (filters.status === "PENDING") {
        where.age = { gte: 6 };
        where.OR = [{ payment: null }, { payment: { status: "PENDING" } }];
      } else {
        where.payment = { status: filters.status };
      }
    }

    return db.familyMember.findMany({
      where,
      orderBy: { name: "asc" },
      include: includeRelations,
    });
  },

  async create(data: {
    name: string;
    age: number;
    atiradorId: number;
    payment?: { status: PaymentStatus; value: number; method: PaymentMethod };
  }) {
    return db.familyMember.create({
      data: {
        name: data.name,
        age: data.age,
        atirador: { connect: { id: data.atiradorId } },
        payment: data.payment
          ? {
              create: {
                status: data.payment.status,
                value: data.payment.value,
                method: data.payment.method,
              },
            }
          : undefined,
      },
      include: includeRelations,
    });
  },

  async update(
    id: number,
    data: {
      name?: string;
      age?: number;
      payment?: { status: PaymentStatus; value: number; method: PaymentMethod };
    },
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.age !== undefined) updateData.age = data.age;

    if (data.payment) {
      updateData.payment = {
        upsert: {
          create: {
            status: data.payment.status,
            value: data.payment.value,
            method: data.payment.method,
          },
          update: {
            status: data.payment.status,
            value: data.payment.value,
            method: data.payment.method,
          },
        },
      };
    }

    return db.familyMember.update({
      where: { id },
      data: updateData,
      include: includeRelations,
    });
  },

  async deleteWithPayment(id: number) {
    const member = await db.familyMember.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!member) return null;

    if (member.payment) {
      await db.payment.delete({ where: { id: member.payment.id } });
    }

    await db.familyMember.delete({ where: { id } });
    return member;
  },
};
