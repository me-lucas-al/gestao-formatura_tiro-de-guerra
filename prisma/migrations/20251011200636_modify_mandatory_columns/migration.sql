/*
  Warnings:

  - You are about to drop the column `familyMemberId` on the `Atirador` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Atirador" DROP CONSTRAINT "Atirador_adminId_fkey";

-- DropIndex
DROP INDEX "public"."Atirador_familyMemberId_key";

-- AlterTable
ALTER TABLE "Atirador" DROP COLUMN "familyMemberId",
ALTER COLUMN "adminId" DROP NOT NULL,
ALTER COLUMN "isPaid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FamilyMember" ALTER COLUMN "isPaid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Atirador" ADD CONSTRAINT "Atirador_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
