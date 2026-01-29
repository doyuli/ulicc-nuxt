import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { tool } from 'ai'
import { z } from 'zod'

export function createPostTool(event: H3Event) {
  return tool({
    description: `Retrieves the FULL Markdown content. Call this AFTER getting a specific 'path' from 'tool-search', 'tool-posts', or the 'path' tool. Required for answering detailed questions about specific content.`,
    inputSchema: z.object({
      path: z.string().describe('The absolute path identifier of the post, e.g., "/posts/variable-interceptor"'),
    }),
    execute: async ({ path }) => {
      const post = await queryCollection(event, 'posts')
        .where('path', '=', path)
        .select('title', 'path', 'description', 'body', 'date', 'tags', 'minRead')
        .first()

      if (!post)
        return null

      return post
    },
  })
}
