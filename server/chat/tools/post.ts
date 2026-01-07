import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { tool } from 'ai'
import { z } from 'zod'

export function createPostTool(event: H3Event) {
  return tool({
    description: `Retrieves the full Markdown content and metadata for a specific blog post.

WHEN TO USE: 
- Crucial for answering detailed questions about a post's content.
- Use this ONLY when you have a validated 'path' (typically obtained from 'tool-posts').
- Essential when metadata (title/description) is insufficient to satisfy the user's query.

WHEN NOT TO USE: 
- Do NOT guess, speculate, or hallucinate a path. 
- If no exact path is known, use 'tool-posts' first to discover the correct identifier.

INPUT REQUIREMENT:
- The 'path' must be a relative string starting with '/posts/'.`,
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
