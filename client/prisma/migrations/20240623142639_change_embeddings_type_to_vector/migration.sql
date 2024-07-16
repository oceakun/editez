-- Ensure the pgvector extension is enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Alter the embeddings column to use the correct vector type
ALTER TABLE "secondbrain_notes_record"
ALTER COLUMN "embeddings" TYPE vector(768)
USING "embeddings"::vector(768);

-- Create the index for vector search
CREATE INDEX ON "secondbrain_notes_record" USING ivfflat ("embeddings" vector_cosine_ops) WITH (lists = 100);
