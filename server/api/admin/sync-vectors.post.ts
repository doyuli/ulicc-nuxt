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

    if (!import.meta.dev) {
      throw createError({
        statusCode: 403,
        message: 'Sync API is only available in development mode',
      })
    }

    const posts = await queryCollection(event, 'posts')
      .where('hidden', '<>', true)
      .select('id', 'title', 'description', 'tags', 'updatedAt')
      .all()

    const postIds = posts.map(p => p.id)

    let deleted = 0

    if (postIds.length > 0) {
      const deleteResult = await db
        .delete(vectorsTable)
        .where(notInArray(vectorsTable.contentId, postIds))
        .returning({ contentId: vectorsTable.contentId })
      deleted = deleteResult.length
    }
    else {
      const deleteResult = await db
        .delete(vectorsTable)
        .returning({ contentId: vectorsTable.contentId })
      deleted = deleteResult.length
    }

    if (!posts.length) {
      return { total: 0, added: 0, updated: 0, skipped: 0, deleted }
    }

    const existingVectors = await db
      .select({
        contentId: vectorsTable.contentId,
        updatedAt: vectorsTable.updatedAt,
      })
      .from(vectorsTable)
      .where(inArray(vectorsTable.contentId, postIds))

    const existingMap = new Map(existingVectors.map(v => [v.contentId, v.updatedAt]))

    const postsToAdd: typeof posts = []
    const postsToUpdate: typeof posts = []

    for (const post of posts) {
      const existingUpdatedAt = existingMap.get(post.id)
      if (!existingUpdatedAt) {
        postsToAdd.push(post)
      }
      else if (post.updatedAt && new Date(post.updatedAt) > existingUpdatedAt) {
        postsToUpdate.push(post)
      }
    }

    const postsToProcess = [...postsToAdd, ...postsToUpdate]
    const skipped = posts.length - postsToProcess.length

    if (postsToProcess.length === 0) {
      return { total: posts.length, added: 0, updated: 0, skipped, deleted }
    }

    const values = postsToProcess.map((post) => {
      const parts = [`文章标题: ${post.title}`]
      if (post.description)
        parts.push(`内容摘要: ${post.description}`)

      if (post.tags?.length)
        parts.push(`分类标签: ${post.tags.join(', ')}`)

      return `${parts.join('\n')}.`
    })

    const { embeddings } = await embedMany({ model, values })

    const records = postsToProcess.map((post, i) => ({
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

    return {
      total: posts.length,
      added: postsToAdd.length,
      updated: postsToUpdate.length,
      skipped,
      deleted,
    }
  })
})
