import { queryCollection } from '@nuxt/content/server'
import { embedMany } from 'ai'
import { inArray, notInArray, sql } from 'drizzle-orm'
import { vectorsTable } from '~~/server/db/schema'

export default defineLazyEventHandler(async () => {
  const siliconflow = useSiliconflow()
  const model = siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B')
  const db = useDb()

  return defineEventHandler(async (event) => {
    await requireUserSession(event)

    const result = { total: 0, added: 0, updated: 0, skipped: 0, deleted: 0 }

    const posts = await queryCollection(event, 'posts')
      .where('hidden', '<>', true)
      .select('id', 'title', 'description', 'tags', 'updatedAt')
      .all()

    const len = posts.length

    if (!len) {
      const deleteds = await db
        .delete(vectorsTable)
        .returning({ contentId: vectorsTable.contentId })

      result.deleted = deleteds.length

      return result
    }

    result.total = len

    const postIds = posts.map(p => p.id)

    const deleteds = await db
      .delete(vectorsTable)
      .where(notInArray(vectorsTable.contentId, postIds))
      .returning({ contentId: vectorsTable.contentId })

    result.deleted = deleteds.length

    const existing = await db
      .select({
        contentId: vectorsTable.contentId,
        updatedAt: vectorsTable.updatedAt,
      })
      .from(vectorsTable)
      .where(inArray(vectorsTable.contentId, postIds))

    const existingUpdatedAtMap = new Map(existing.map(v => [v.contentId, v.updatedAt]))

    const shouldAddPosts: typeof posts = []
    const shouldUpdatePosts: typeof posts = []

    for (const post of posts) {
      const updatedAt = existingUpdatedAtMap.get(post.id)
      if (!updatedAt) {
        shouldAddPosts.push(post)
      }
      else if (post.updatedAt && new Date(post.updatedAt) > new Date(updatedAt)) {
        shouldUpdatePosts.push(post)
      }
    }

    const shouldProcessPosts = [...shouldAddPosts, ...shouldUpdatePosts]
    result.added = shouldAddPosts.length
    result.updated = shouldUpdatePosts.length
    result.skipped = len - shouldProcessPosts.length

    if (shouldProcessPosts.length === 0)
      return result

    const values = shouldProcessPosts.map((post) => {
      const parts = [`文章标题: ${post.title}`]
      if (post.description)
        parts.push(`内容摘要: ${post.description}`)

      if (post.tags?.length)
        parts.push(`分类标签: ${post.tags.join(', ')}`)

      return `${parts.join('\n')}.`
    })

    const { embeddings } = await embedMany({ model, values })

    const records = shouldProcessPosts.map((post, i) => ({
      contentId: post.id,
      content: values[i],
      embedding: embeddings[i],
      updatedAt: new Date(),
    }))

    await db.insert(vectorsTable)
      .values(records)
      .onConflictDoUpdate({
        target: vectorsTable.contentId,
        set: {
          embedding: sql`EXCLUDED.embedding`,
          content: sql`EXCLUDED.content`,
          updatedAt: sql`EXCLUDED.updated_at`,
        },
      })

    return result
  })
})
