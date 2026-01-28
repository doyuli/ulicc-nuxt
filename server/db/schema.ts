import { index, pgTable, text, timestamp, varchar, vector } from 'drizzle-orm/pg-core'

export const vectorsTable = pgTable(
  'content_vectors',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    postId: varchar('post_id', { length: 191 }).notNull(),
    sectionId: varchar('section_id', { length: 191 }).notNull().unique(),
    title: text('title').notNull(),
    heading: text('heading'),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1024 }).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    embeddingIndex: index('embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
    postIdIndex: index('post_id_idx').on(table.postId),
  }),
)

export const summarysTable = pgTable(
  'content_summarys',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    contentId: varchar('content_id', { length: 191 }).notNull().unique(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
)
