/*
  Warnings:

  - A unique constraint covering the columns `[familyMemberId]` on the table `Atirador` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Atirador" ADD COLUMN     "familyMemberId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Atirador_familyMemberId_key" ON "Atirador"("familyMemberId");
