import { queryCollection } from '@nuxt/content/server'
import { sql } from 'drizzle-orm'
import { summarysTable, vectorsTable } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = useDb()

  const totalPosts = await queryCollection(event, 'posts')
    .where('hidden', '<>', true)
    .count()

  const vectorized = await db
    .select({ count: sql<number>`count(DISTINCT ${vectorsTable.postId})::int` })
    .from(vectorsTable)
    .then(r => r[0]?.count ?? 0)

  const summarized = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(summarysTable)
    .then(r => r[0]?.count ?? 0)

  return {
    totalPosts,
    vectorized,
    summarized,
  }
})
