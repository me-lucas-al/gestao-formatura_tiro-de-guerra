-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- AlterTable: add role with default
ALTER TABLE "Admin" ADD COLUMN "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';

-- AlterTable: add email as nullable first to allow backfill
ALTER TABLE "Admin" ADD COLUMN "email" TEXT;

-- Backfill existing rows with placeholder emails
UPDATE "Admin" SET "email" = 'admin_' || "id" || '@tg02009.eb.mil.br' WHERE "email" IS NULL;

-- Make email non-nullable and unique
ALTER TABLE "Admin" ALTER COLUMN "email" SET NOT NULL;
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
