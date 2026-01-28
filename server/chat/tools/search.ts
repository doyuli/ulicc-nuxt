import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { tool } from 'ai'
import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { LRUCache } from 'lru-cache'
import { z } from 'zod'
import { vectorsTable } from '~~/server/db/schema'

const embeddingCache = new LRUCache<string, number[]>({
  max: 100,
})

export function createSearchTool(event: H3Event) {
  const siliconflow = useSiliconflow()
  const model = siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B')
  const db = useDb()

  return tool({
    description: `[PRIMARY TOOL] Performs a semantic vector search. Use this for ANY technical questions, concept lookups, or "how-to" queries (e.g., "optimization", "Nuxt auth"). It finds relevant articles based on meaning even without exact keyword matches.`,
    inputSchema: z.object({
      query: z.string().describe('The search query in natural language.'),
    }),
    execute: async ({ query }) => {
      let embedding = embeddingCache.get(query)

      if (!embedding) {
        try {
          embedding = await generateEmbedding(query, model)
          embeddingCache.set(query, embedding)
        }
        catch {
          return null
        }
      }

      const similarity = sql<number>`1 - (${cosineDistance(vectorsTable.embedding, embedding)})`

      const vectorResults = await db
        .select({
          postId: vectorsTable.postId,
          similarity,
        })
        .from(vectorsTable)
        .where(gt(similarity, 0.35))
        .orderBy(t => desc(t.similarity))
        .limit(12)

      if (vectorResults.length === 0)
        return []

      const postScores = new Map<string, number>()
      for (const r of vectorResults) {
        const current = postScores.get(r.postId) ?? 0
        if (r.similarity > current) {
          postScores.set(r.postId, r.similarity)
        }
      }

      const topPosts = [...postScores.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)

      const topPostIds = topPosts.map(([id]) => id)

      const posts = await queryCollection(event, 'posts')
        .where('id', 'IN', topPostIds)
        .select('id', 'title', 'path', 'description', 'date', 'tags')
        .all()

      const postsMap = new Map(posts.map(p => [p.id, p]))

      return topPosts
        .map(([postId, similarity]) => {
          const post = postsMap.get(postId)
          return post ? { ...post, similarity: Number(similarity.toFixed(4)) } : null
        })
        .filter(Boolean)
    },
  })
}
