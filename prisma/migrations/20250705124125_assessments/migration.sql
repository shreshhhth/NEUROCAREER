/*
  Warnings:

  - You are about to drop the `Assesments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assesments" DROP CONSTRAINT "Assesments_userId_fkey";

-- DropTable
DROP TABLE "Assesments";

-- CreateTable
CREATE TABLE "Assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizScore" DOUBLE PRECISION NOT NULL,
    "questions" JSONB[],
    "category" TEXT NOT NULL,
    "improvementTip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assessments_userId_idx" ON "Assessments"("userId");

-- AddForeignKey
ALTER TABLE "Assessments" ADD CONSTRAINT "Assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
