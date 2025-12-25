import { defineCollection, defineContentConfig, z } from '@nuxt/content'

function createBaseSchema() {
  return z.object({
    title: z.string(),
    description: z.string(),
    /**
     * 优先级，0-1000，1000 为置顶
     */
    priority: z.number().min(0).max(1000).int().default(0),
  })
}

function createPostSchema() {
  return createBaseSchema().extend({
    minRead: z.number(),
    date: z.date(),
    hidden: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  })
}

function createToolsSchema() {
  return createBaseSchema().extend({
    links: z.array(z.object({
      name: z.string(),
      href: z.string().url(),
      image: z.string().url(),
      description: z.string(),
    })),
  })
}

function createSnippetsSchema() {
  return createBaseSchema().extend({
    language: z.string(),
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
    tools: defineCollection({
      type: 'data',
      source: 'tools/*.json',
      schema: createToolsSchema(),
    }),
    snippets: defineCollection({
      type: 'page',
      source: 'snippets/*.md',
      schema: createSnippetsSchema(),
    }),
    about: defineCollection({
      type: 'page',
      source: 'about.md',
      schema: createBaseSchema().extend({
        currentStacks: z.array(z.string()).default([]),
      }),
    }),
  },
})
