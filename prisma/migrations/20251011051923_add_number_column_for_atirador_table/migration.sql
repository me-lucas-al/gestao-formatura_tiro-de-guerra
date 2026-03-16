/*
  Warnings:

  - Added the required column `number` to the `Atirador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Atirador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Atirador" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
