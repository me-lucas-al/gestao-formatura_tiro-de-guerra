/*
  Warnings:

  - Added the required column `age` to the `FamilyMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FamilyMember" ADD COLUMN     "age" INTEGER NOT NULL;
