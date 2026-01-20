import { queryCollection } from '@nuxt/content/server'
import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { contentVectors } from '~~/server/db/schema'

export default defineLazyEventHandler(async () => {
  const siliconflow = useSiliconflow()
  const model = siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B')
  const db = useDb()

  return defineEventHandler(async (event) => {
    const { query } = await readBody(event)
    if (!query)
      throw createError({ statusCode: 400, message: 'Query is required' })

    const embedding = await generateEmbedding(query, model)

    const similarity = sql<number>`1 - (${cosineDistance(contentVectors.embedding, embedding)})`

    const vectorResults = await db
      .select({
        contentId: contentVectors.contentId,
        similarity,
      })
      .from(contentVectors)
      .where(gt(similarity, 0.35))
      .orderBy(t => desc(t.similarity))
      .limit(4)

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
          similarity: Number(v.similarity.toFixed(4)),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  })
})
