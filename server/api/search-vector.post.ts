import { createOpenAI } from '@ai-sdk/openai'
import { queryCollection } from '@nuxt/content/server'
import { embed } from 'ai'
import { desc, gt, sql } from 'drizzle-orm'
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
    const { query } = await readBody(event)
    if (!query)
      throw createError({ statusCode: 400, message: 'Query is required' })

    const { embedding } = await embed({
      model: siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B'),
      value: `Queries: ${query}`,
    })

    const similarity = sql<number>`1 - (${contentVectors.embedding} <=> ${JSON.stringify(embedding)})`

    const vectorResults = await db
      .select({
        contentId: contentVectors.contentId,
        score: similarity,
      })
      .from(contentVectors)
      .where(gt(similarity, 0.35))
      .orderBy(desc(similarity))
      .limit(10)

    if (vectorResults.length === 0)
      return []

    const contentIds = vectorResults.map(r => r.contentId)
    const posts = await queryCollection(event, 'posts')
      .where('id', 'IN', contentIds)
      .select('id', 'title', 'path', 'description', 'date', 'tags')
      .all()

    const postsMap = new Map(posts.map(p => [p.id, p]))

    return vectorResults
      .map((v) => {
        const post = postsMap.get(v.contentId)
        if (!post)
          return null

        return {
          ...post,
          score: Number(v.score.toFixed(4)),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  })
})
