import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { tool } from 'ai'
import { z } from 'zod'

export function createPostTool(event: H3Event) {
  return tool({
    description: `Retrieves the full content and details of a specific Nuxt blog post.

WHEN TO USE: Use this tool when you know the EXACT path to a blog post. Common scenarios:
- User asks for a specific post: "Get the blog post about Nuxt 4" → /blog/v4
- You found a relevant post from list_blog_posts and want the full content
- You know the post slug from context

WHEN NOT TO USE: If you don't know the exact path and need to search/discover, use tool-posts first.

EXAMPLES: "/posts/async-catch", "/posts/css-behavior"`,
    inputSchema: z.object({
      path: z.string().describe('The path to the blog post (e.g., /posts/async-catch)'),
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
