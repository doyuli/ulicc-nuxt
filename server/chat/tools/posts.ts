import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { tool } from 'ai'
import { z } from 'zod'

export function createPostsTool(event: H3Event) {
  return tool({
    description: `Lists all blog posts with metadata including titles, date, minRead, tags, and descriptions.

WHEN TO USE: Use this tool when you need to DISCOVER or SEARCH for blog posts. Common scenarios:
- "When asked to count or summarize posts by certain criteria" - blog statistics
- "Has there been any post about X feature?" - search by keywords in titles, descriptions, or tags
- "Show me performance improvements" - finding specific technical topics or update logs.
- "What's new in Blog?" - retrieving the latest updates sorted by date.

WHEN NOT TO USE: If you already know the exact blog post path (e.g., "/posts/variable-interceptor"), use tool-post directly to fetch full content.

OUTPUT: Returns a list of post objects {title, description, date, path, tags, minRead}. To provide detailed answers about a specific post's content, you must follow up by calling 'tool-post' with the relevant path.`,
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
