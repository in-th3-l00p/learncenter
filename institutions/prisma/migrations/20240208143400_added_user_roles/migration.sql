/*
  Warnings:

  - Added the required column `role` to the `UsersOnInstitutions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'USER', 'GUEST', 'PENDING', 'BANNED', 'DELETED');

-- AlterTable
ALTER TABLE "UsersOnInstitutions" ADD COLUMN     "role" "UserRole" NOT NULL;
