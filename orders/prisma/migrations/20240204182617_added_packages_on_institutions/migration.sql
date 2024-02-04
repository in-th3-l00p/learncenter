/*
  Warnings:

  - You are about to drop the column `packageId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_packageId_fkey";

-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "packageId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "packageId";

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
