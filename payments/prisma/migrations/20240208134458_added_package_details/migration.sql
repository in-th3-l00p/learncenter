/*
  Warnings:

  - Added the required column `newClassroomsAmount` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newUsersAmount` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "newClassroomsAmount" INTEGER NOT NULL,
ADD COLUMN     "newUsersAmount" INTEGER NOT NULL;
