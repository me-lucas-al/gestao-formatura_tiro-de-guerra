/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Atirador` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `FamilyMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Atirador" DROP COLUMN "isPaid";

-- AlterTable
ALTER TABLE "FamilyMember" DROP COLUMN "isPaid";
