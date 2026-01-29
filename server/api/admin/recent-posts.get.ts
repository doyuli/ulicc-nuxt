import { queryCollection } from '@nuxt/content/server'
import { inArray } from 'drizzle-orm'
import { summarysTable, vectorsTable } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = useDb()

  let { page = 1, pagesize = 4 } = getQuery(event)
  page = Number(page)
  pagesize = Number(pagesize)

  const result: {
    total: number
    posts: {
      id: string
      title: string
      date: string
      path: string
      summary: boolean
      vector: boolean
    }[]
  } = { total: 0, posts: [] }

  const posts = await queryCollection(event, 'posts')
    .where('hidden', '<>', true)
    .select('id', 'title', 'date', 'path')
    .all()

  if (!posts.length)
    return result

  const postIds = posts.map(p => p.id)

  const [vectorizedIds, summarizedIds] = await Promise.all([
    db.selectDistinct({ postId: vectorsTable.postId })
      .from(vectorsTable)
      .where(inArray(vectorsTable.postId, postIds))
      .then(rows => new Set(rows.map(r => r.postId))),
    db.select({ postId: summarysTable.postId })
      .from(summarysTable)
      .where(inArray(summarysTable.postId, postIds))
      .then(rows => new Set(rows.map(r => r.postId))),
  ])

  const sorted = posts.map(post => ({
    ...post,
    summary: summarizedIds.has(post.id),
    vector: vectorizedIds.has(post.id),
  })).sort((a, b) => {
    if (a.summary !== b.summary)
      return a.summary ? 1 : -1

    if (a.vector !== b.vector)
      return a.vector ? 1 : -1

    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const start = (page - 1) * pagesize
  result.posts = sorted.slice(start, start + pagesize)
  result.total = sorted.length

  return result
})
