import { queryCollection } from '@nuxt/content/server'
import { eq } from 'drizzle-orm'
import { summarysTable } from '~~/server/db/schema'
import { HTTP_STATUS } from '~~/shared/constants'

export default defineLazyEventHandler(async () => {
  const db = useDb()
  return defineEventHandler(async (event) => {
    const { path } = getQuery(event)

    if (!path)
      throw createError({ statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Path is required' })

    const post = await queryCollection(event, 'posts')
      .where('path', '=', path)
      .select('id', 'description')
      .first()

    if (!post)
      throw createError({ statusCode: HTTP_STATUS.NOT_FOUND, message: 'Post not found' })

    const [existing] = await db
      .select({ summary: summarysTable.summary })
      .from(summarysTable)
      .where(eq(summarysTable.postId, post.id))
      .limit(1)

    return existing?.summary ?? post.description ?? ''
  })
})
