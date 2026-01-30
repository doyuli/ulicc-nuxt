import { queryCollection } from '@nuxt/content/server'
import { generateText } from 'ai'
import { eq, sql } from 'drizzle-orm'
import { summarysTable } from '~~/server/db/schema'
import { HTTP_STATUS } from '~~/shared/constants'

export default defineLazyEventHandler(async () => {
  const deepseek = useDeepSeek()
  const db = useDb()
  return defineEventHandler(async (event) => {
    const { path, lang = 'zh-CN' } = await readBody(event)

    if (!path)
      throw createError({ statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Path is required' })

    const post = await queryCollection(event, 'posts')
      .where('path', '=', path)
      .select('id', 'title', 'rawbody')
      .first()

    if (!post)
      throw createError({ statusCode: HTTP_STATUS.NOT_FOUND, message: 'Post not found' })

    const existing = await db
      .select()
      .from(summarysTable)
      .where(eq(summarysTable.postId, post.id))
      .limit(1)

    if (existing.length > 0) {
      return existing[0].summary
    }

    const cleanBody = post.rawbody.replace(/^---[\s\S]+?---/, '').trim()

    const result = await generateText({
      model: deepseek('deepseek-chat'),
      system: 'You are a professional content summarizer. Create concise, engaging, and highly readable summaries that capture the core value of the article.',
      prompt: `Summarize this in "${lang}" language: "${post.title}"
      
      Content:
      ${cleanBody} 
      
      CONCISE SUMMARY:`,
      onFinish: async ({ text }) => {
        await db.insert(summarysTable)
          .values({
            postId: post.id,
            title: post.title,
            summary: text,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: summarysTable.postId,
            set: {
              summary: sql`EXCLUDED.summary`,
              updatedAt: sql`EXCLUDED.updated_at`,
            },
          })
      },
    })

    return result.text
  })
})
