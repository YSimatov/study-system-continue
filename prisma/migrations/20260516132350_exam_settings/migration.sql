-- CreateEnum
CREATE TYPE "ExamMode" AS ENUM ('RANDOM', 'FIXED');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "inExam" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "examMode" "ExamMode" NOT NULL DEFAULT 'RANDOM',
ADD COLUMN     "questionsPerSubtopic" INTEGER NOT NULL DEFAULT 3;
