import { queryCollection } from '@nuxt/content/server'
import { inArray } from 'drizzle-orm'
import { summarysTable, vectorsTable } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = useDb()

  const posts = await queryCollection(event, 'posts')
    .where('hidden', '<>', true)
    .order('date', 'DESC')
    .select('id', 'title', 'date')
    .limit(4)
    .all()

  if (!posts.length) {
    return []
  }

  const postIds = posts.map(p => p.id)

  const vectorizedIds = await db
    .select({ contentId: vectorsTable.contentId })
    .from(vectorsTable)
    .where(inArray(vectorsTable.contentId, postIds))
    .then(rows => new Set(rows.map(r => r.contentId)))

  const summarizedIds = await db
    .select({ contentId: summarysTable.contentId })
    .from(summarysTable)
    .where(inArray(summarysTable.contentId, postIds))
    .then(rows => new Set(rows.map(r => r.contentId)))

  return posts.map(post => ({
    id: post.id,
    title: post.title,
    date: post.date,
    summary: summarizedIds.has(post.id),
    vector: vectorizedIds.has(post.id),
  }))
})
