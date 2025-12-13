import { defineCollection, defineContentConfig, z } from '@nuxt/content'

function createPostSchema() {
  return z.object({
    title: z.string(),
    description: z.string(),
    minRead: z.number(),
    date: z.date(),
    hidden: z.boolean().default(false),
    /**
     * 优先级，0-1000，1000 为置顶
     */
    priority: z.number().min(0).max(1000).int().default(0),
    tags: z.array(z.string()).default([]),
  })
}

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: createPostSchema(),
    }),
  },
})
