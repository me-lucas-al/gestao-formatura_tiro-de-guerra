"use server";

import { prismaClient } from "@gestao_formatura/shared";
import {
  PaymentEntitySchema,
  type CreatePaymentInput,
  type UpdatePaymentInput,
} from "../../dto/payment.schema";
import type { IPaymentRepository } from "../interfaces/payment.repository.interface";

export const findAtiradorById: IPaymentRepository["findAtiradorById"] = async (
  id,
) => {
  return prismaClient.atirador.findUnique({
    where: { id },
    select: { id: true },
  });
};

export const findFamilyMemberById: IPaymentRepository["findFamilyMemberById"] =
  async (id) => {
    return prismaClient.familyMember.findUnique({
      where: { id },
      select: { id: true },
    });
  };

export const findPaymentById: IPaymentRepository["findPaymentById"] = async (
  id,
) => {
  const payment = await prismaClient.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    return null;
  }

  return PaymentEntitySchema.parse(payment);
};

export const create: IPaymentRepository["create"] = async (
  input: CreatePaymentInput,
) => {
  const payment = await prismaClient.payment.create({
    data: {
      status: input.status ?? "PENDING",
      value: input.value ?? 0,
      method: input.method ?? "CASH",
      atiradorId: input.atiradorId,
      familyMemberId: input.familyMemberId,
    },
  });

  return PaymentEntitySchema.parse(payment);
};

export const update: IPaymentRepository["update"] = async (
  input: UpdatePaymentInput,
) => {
  const updateData: Record<string, unknown> = {};

  if (input.status !== undefined) {
    updateData.status = input.status;
  }

  if (input.value !== undefined) {
    updateData.value = input.value;
  }

  if (input.method !== undefined) {
    updateData.method = input.method;
  }

  if (input.atiradorId !== undefined) {
    updateData.atiradorId = input.atiradorId;
  }

  if (input.familyMemberId !== undefined) {
    updateData.familyMemberId = input.familyMemberId;
  }

  const payment = await prismaClient.payment.update({
    where: { id: input.id },
    data: updateData,
  });

  return PaymentEntitySchema.parse(payment);
};

export const paymentRepository: IPaymentRepository = {
  findAtiradorById,
  findFamilyMemberById,
  findPaymentById,
  create,
  update,
};
