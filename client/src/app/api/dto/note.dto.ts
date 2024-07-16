import { z } from "zod";

export const noteDto = z.object({
  title: z.string(),
  content: z.string(),
  created_at: z.date().optional(),
  embeddings: z.any().optional(), // Ensure this matches the Float[] type in Prisma schema
});

export type NoteDto = z.infer<typeof noteDto>;
