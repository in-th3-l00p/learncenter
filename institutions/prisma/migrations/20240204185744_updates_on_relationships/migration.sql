/*
  Warnings:

  - You are about to drop the column `userId` on the `Institution` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Institution` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Institution" DROP CONSTRAINT "Institution_userId_fkey";

-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UsersOnInstitutions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsersOnInstitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToInstitution" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToInstitution_AB_unique" ON "_UserToInstitution"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToInstitution_B_index" ON "_UserToInstitution"("B");

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnInstitutions" ADD CONSTRAINT "UsersOnInstitutions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnInstitutions" ADD CONSTRAINT "UsersOnInstitutions_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToInstitution" ADD CONSTRAINT "_UserToInstitution_A_fkey" FOREIGN KEY ("A") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToInstitution" ADD CONSTRAINT "_UserToInstitution_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
