import { queryCollection } from '@nuxt/content/server'
import { sql } from 'drizzle-orm'
import { summarysTable, vectorsTable } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = useDb()

  const [totalPosts, vectorized, summarized] = await Promise.all([
    queryCollection(event, 'posts')
      .where('hidden', '<>', true)
      .count(),
    db.select({ count: sql<number>`count(DISTINCT ${vectorsTable.postId})::int` })
      .from(vectorsTable)
      .then(r => r[0]?.count ?? 0),
    db.select({ count: sql<number>`count(*)::int` })
      .from(summarysTable)
      .then(r => r[0]?.count ?? 0),
  ])

  return {
    totalPosts,
    vectorized,
    summarized,
  }
})
