/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `FamilyMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_atiradorId_fkey";

-- AlterTable
ALTER TABLE "Atirador" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "isPaid",
ALTER COLUMN "atiradorId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_paymentId_key" ON "FamilyMember"("paymentId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_atiradorId_fkey" FOREIGN KEY ("atiradorId") REFERENCES "Atirador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
