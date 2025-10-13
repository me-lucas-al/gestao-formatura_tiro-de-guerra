/*
  Warnings:

  - You are about to drop the column `familyMemberQuantity` on the `Atirador` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Atirador" DROP COLUMN "familyMemberQuantity";

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "atiradorId" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentId" INTEGER,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_atiradorId_fkey" FOREIGN KEY ("atiradorId") REFERENCES "Atirador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
