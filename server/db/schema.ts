import { index, pgTable, text, timestamp, varchar, vector } from 'drizzle-orm/pg-core'

export const contentVectors = pgTable(
  'content_vectors',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    contentId: varchar('content_id', { length: 191 }).notNull().unique(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1024 }).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    embeddingIndex: index('embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
  }),
)
