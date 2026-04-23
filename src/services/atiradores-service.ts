import { db } from "@/lib/prisma";
import type { AtiradorWithRelations } from "@packages/types";
import type { PaymentStatus, PaymentMethod } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AtiradorFilters = {
  year: number;
  name?: string;
  number?: number;
  status?: string;
};

export type CreateAtiradorInput = {
  name: string;
  number: number;
  year: number;
  adminId?: number;
  payment?: {
    status: PaymentStatus;
    value: number;
    method: PaymentMethod;
  };
};

const includeRelations = {
  payment: true,
  admin: true,
  familyMembers: {
    include: {
      payment: true,
    },
  },
} as const;

export const AtiradoresService = {
  async alignAtiradorIdSequence() {
    await db.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"Atirador"', 'id'),
        COALESCE((SELECT MAX(id) FROM "Atirador"), 1),
        true
      );
    `);
  },

  async findMany(filters: AtiradorFilters): Promise<AtiradorWithRelations[]> {
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

    return db.atirador.findMany({
      where,
      orderBy: { number: "asc" },
      include: includeRelations,
    });
  },

  async findByNumber(number: number, year: number) {
    return db.atirador.findFirst({ where: { number, year } });
  },

  async create(data: CreateAtiradorInput) {
    const createData = {
      name: data.name,
      number: data.number,
      year: data.year,
      adminId: data.adminId,
      payment: data.payment
        ? {
            create: {
              status: data.payment.status,
              value: data.payment.value,
              method: data.payment.method,
            },
          }
        : undefined,
    };

    try {
      return await db.atirador.create({
        data: createData,
        include: includeRelations,
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      if (error.code !== "P2002") {
        throw error;
      }

      const target = String((error.meta as { target?: unknown })?.target ?? "");
      const isIdError = target.includes("id") || error.message.includes("`id`") || error.message.includes("'id'");
      if (!isIdError) {
        throw error;
      }

      await this.alignAtiradorIdSequence();

      return db.atirador.create({
        data: createData,
        include: includeRelations,
      });
    }
  },

  async update(
    id: number,
    data: {
      name?: string;
      number?: number;
      payment?: { status: PaymentStatus; value: number; method: PaymentMethod };
    },
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.number !== undefined) updateData.number = data.number;

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

    return db.atirador.update({
      where: { id },
      data: updateData,
      include: includeRelations,
    });
  },

  async deleteWithRelations(id: number) {
    const atirador = await db.atirador.findUnique({
      where: { id },
      include: {
        payment: true,
        familyMembers: { include: { payment: true } },
      },
    });

    if (!atirador) return null;

    for (const member of atirador.familyMembers) {
      if (member.payment) {
        await db.payment.delete({ where: { id: member.payment.id } });
      }
      await db.familyMember.delete({ where: { id: member.id } });
    }

    if (atirador.payment) {
      await db.payment.delete({ where: { id: atirador.payment.id } });
    }

    await db.atirador.delete({ where: { id } });
    return atirador;
  },

  async getTotalArrecadado(year: number): Promise<number> {
    const paidStatuses: PaymentStatus[] = ["PAID", "FIRST_INSTALLMENT_PAID"];

    const atiradorPayments = await db.payment.aggregate({
      _sum: { value: true },
      where: {
        status: { in: paidStatuses },
        atirador: { year },
      },
    });

    const familyPayments = await db.payment.aggregate({
      _sum: { value: true },
      where: {
        status: { in: paidStatuses },
        familyMember: { atirador: { year } },
      },
    });

    return (
      (atiradorPayments._sum.value || 0) + (familyPayments._sum.value || 0)
    );
  },
};
