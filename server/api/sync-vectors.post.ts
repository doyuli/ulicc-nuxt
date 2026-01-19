import { createOpenAI } from '@ai-sdk/openai'
import { queryCollection } from '@nuxt/content/server'
import { embedMany } from 'ai'
import { sql } from 'drizzle-orm'
import { contentVectors } from '../db/schema'

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().siliconflowApiKey
  if (!apiKey)
    throw new Error('Missing AI Gateway API key')

  const siliconflow = createOpenAI({
    baseURL: 'https://api.siliconflow.cn/v1',
    apiKey,
  })
  const db = useDb()

  return defineEventHandler(async (event) => {
    const posts = await queryCollection(event, 'posts')
      .select('id', 'title', 'description', 'tags')
      .all()

    if (!posts.length)
      return { success: true, count: 0 }

    const values = posts.map((post) => {
      const parts = [`Title: ${post.title}`]
      if (post.description)
        parts.push(`Description: ${post.description}`)

      if (post.tags?.length)
        parts.push(`Tags: ${post.tags.join(', ')}`)

      return `${parts.join('. ')}.`
    })
    const { embeddings } = await embedMany({
      model: siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B'),
      values,
    })

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
