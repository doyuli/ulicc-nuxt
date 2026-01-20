import { queryCollection } from '@nuxt/content/server'
import { embedMany } from 'ai'
import { inArray, sql } from 'drizzle-orm'
import { contentVectors } from '~~/server/db/schema'

export default defineLazyEventHandler(async () => {
  const siliconflow = useSiliconflow()
  const model = siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B')
  const db = useDb()

  return defineEventHandler(async (event) => {
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

    if (!posts.length)
      return { success: true, count: 0, skipped: 0 }

    const existingVectors = await db
      .select({
        contentId: contentVectors.contentId,
        updatedAt: contentVectors.updatedAt,
      })
      .from(contentVectors)
      .where(inArray(contentVectors.contentId, posts.map(p => p.id)))

    const existingMap = new Map(existingVectors.map(v => [v.contentId, v.updatedAt]))

    const postsToUpdate = posts.filter((post) => {
      const existingUpdatedAt = existingMap.get(post.id)
      if (!existingUpdatedAt)
        return true
      if (!post.updatedAt)
        return false
      return new Date(post.updatedAt) > existingUpdatedAt
    })

    if (postsToUpdate.length === 0) {
      return { success: true, count: 0, skipped: posts.length }
    }

    const values = postsToUpdate.map((post) => {
      const parts = [`文章标题: ${post.title}`]
      if (post.description)
        parts.push(`内容摘要: ${post.description}`)

      if (post.tags?.length)
        parts.push(`分类标签: ${post.tags.join(', ')}`)

      return `${parts.join('\n')}.`
    })

    const { embeddings } = await embedMany({ model, values })

    const records = postsToUpdate.map((post, i) => ({
      contentId: post.id,
      content: values[i],
      embedding: embeddings[i],
      updatedAt: new Date(),
    }))

    await db.insert(contentVectors)
      .values(records)
      .onConflictDoUpdate({
        target: contentVectors.contentId,
        set: {
          embedding: sql`EXCLUDED.embedding`,
          content: sql`EXCLUDED.content`,
          updatedAt: sql`EXCLUDED.updated_at`,
        },
      })

    return {
      success: true,
      count: records.length,
      skipped: posts.length - postsToUpdate.length,
    }
  })
})
