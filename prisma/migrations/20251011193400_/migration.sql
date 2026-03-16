/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `Atirador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[familyMemberId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Atirador" ADD COLUMN     "paymentId" INTEGER;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "familyMemberId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Atirador_paymentId_key" ON "Atirador"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_familyMemberId_key" ON "Payment"("familyMemberId");
