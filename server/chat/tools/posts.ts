import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { tool } from 'ai'
import { z } from 'zod'

export function createPostsTool(event: H3Event) {
  return tool({
    description: `[LIST MODE] Retrieves a chronological list of all blog posts. Use ONLY when the user explicitly asks for a "list of articles", "latest posts", "archive", or "count". DO NOT use this for specific technical questions (use 'tool-search' instead).`,
    inputSchema: z.object({}),
    execute: async () => {
      const posts = await queryCollection(event, 'posts')
        .where('hidden', '<>', true)
        .order('priority', 'DESC')
        .order('date', 'DESC')
        .select('title', 'path', 'description', 'date', 'tags', 'minRead')
        .all()

      if (!posts)
        return null

      return posts
    },
  })
}
