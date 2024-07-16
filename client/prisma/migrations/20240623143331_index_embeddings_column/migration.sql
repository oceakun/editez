/*
  Warnings:

  - The `embeddings` column on the `secondbrain_notes_record` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "secondbrain_notes_record_embeddings_idx";

-- AlterTable
ALTER TABLE "secondbrain_notes_record" DROP COLUMN "embeddings",
ADD COLUMN     "embeddings" DOUBLE PRECISION[];
