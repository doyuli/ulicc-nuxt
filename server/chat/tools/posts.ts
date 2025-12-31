import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { tool } from 'ai'
import { z } from 'zod'

export function createPostsTool(event: H3Event) {
  return tool({
    description: `Lists all blog posts with metadata including titles, date, minRead, tags, and descriptions.

WHEN TO USE: Use this tool when you need to DISCOVER or SEARCH for blog posts. Common scenarios:
- "What are the latest announcements?" - browse recent posts
- "Has there been any post about X feature?" - search by topic
- "Show me performance improvements" - find relevant posts by topic
- "What's new in Nuxt?" - explore recent updates

WHEN NOT TO USE: If you already know the exact blog post path (e.g., "/posts/async-catch"), use tool-post directly.

OUTPUT: Returns list of posts with title, description, date, path. Use tool-post to retrieve full content of specific posts.`,
    inputSchema: z.object({}),
    execute: async () => {
      const posts = await queryCollection(event, 'posts')
        .select('title', 'path', 'description', 'date', 'tags', 'minRead')
        .all()

      if (!posts)
        return null

      return posts
    },
  })
}
