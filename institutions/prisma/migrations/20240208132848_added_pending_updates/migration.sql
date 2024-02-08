-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "classroomsAmount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "pendingUpdateId" INTEGER,
ADD COLUMN     "usersAmount" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "PendingUpdate" (
    "id" SERIAL NOT NULL,
    "newClassroomsAmount" INTEGER NOT NULL,
    "newUsersAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_pendingUpdateId_fkey" FOREIGN KEY ("pendingUpdateId") REFERENCES "PendingUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
