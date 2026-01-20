import { queryCollection } from '@nuxt/content/server'
import { embedMany } from 'ai'
import { sql } from 'drizzle-orm'
import { contentVectors } from '~~/server/db/schema'

export default defineLazyEventHandler(async () => {
  const siliconflow = useSiliconflow()
  const model = siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B')
  const db = useDb()

  return defineEventHandler(async (event) => {
    const posts = await queryCollection(event, 'posts')
      .where('hidden', '<>', true)
      .select('id', 'title', 'description', 'tags')
      .all()

    if (!posts.length)
      return { success: true, count: 0 }

    const values = posts.map((post) => {
      const parts = [`文章标题: ${post.title}`]
      if (post.description)
        parts.push(`内容摘要: ${post.description}`)

      if (post.tags?.length)
        parts.push(`分类标签: ${post.tags.join(', ')}`)

      return `${parts.join('\n')}.`
    })

    const { embeddings } = await embedMany({ model, values })

    const records = posts.map((post, i) => ({
      contentId: post.id,
      content: values[i],
      embedding: embeddings[i],
    }))

    await db.insert(contentVectors)
      .values(records)
      .onConflictDoUpdate({
        target: contentVectors.contentId,
        set: {
          embedding: sql`EXCLUDED.embedding`,
          content: sql`EXCLUDED.content`,
        },
      })

    return { success: true, count: records.length }
  })
})
