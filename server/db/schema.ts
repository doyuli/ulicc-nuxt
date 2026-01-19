import { index, pgTable, text, uuid, vector } from 'drizzle-orm/pg-core'

export const contentVectors = pgTable(
  'content_vectors',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    contentId: text('content_id').notNull().unique(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1024 }).notNull(),
  },
  table => ({
    embeddingIndex: index('embedding_idx').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
)
