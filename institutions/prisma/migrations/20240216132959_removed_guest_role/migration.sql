/*
  Warnings:

  - The values [OWNER,GUEST] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'USER', 'PENDING', 'BANNED', 'DELETED');
ALTER TABLE "UsersOnInstitutions" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropIndex
DROP INDEX "User_firstName_key";

-- DropIndex
DROP INDEX "User_lastName_key";

-- DropIndex
DROP INDEX "User_phone_key";
