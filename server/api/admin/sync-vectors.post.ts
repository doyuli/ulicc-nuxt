import { queryCollection, queryCollectionSearchSections } from '@nuxt/content/server'
import { embedMany } from 'ai'
import { inArray, notInArray, sql } from 'drizzle-orm'
import { vectorsTable } from '~~/server/db/schema'

const getPostId = (sectionId: string) => `${sectionId.split('#')[0]}.md`

interface ShouldProcessSectionItem {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
  postId: string
  postTitle: string
  postUpdatedAt: string | undefined
  heading: string | null
}

export default defineLazyEventHandler(async () => {
  const siliconflow = useSiliconflow()
  const model = siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B')
  const db = useDb()

  return defineEventHandler(async (event) => {
    await requireUserSession(event)

    const result = { total: 0, added: 0, updated: 0, skipped: 0, deleted: 0 }

    const posts = await queryCollection(event, 'posts')
      .where('hidden', '<>', true)
      .select('path', 'title', 'updatedAt')
      .all()

    if (!posts.length) {
      const deleteds = await db
        .delete(vectorsTable)
        .returning({ sectionId: vectorsTable.sectionId })

      result.deleted = deleteds.length
      return result
    }

    const postsMap = new Map(posts.map(p => [p.path, p]))

    const sections = (await queryCollectionSearchSections(event, 'posts', {
      ignoredTags: [
        'pre',
        'html',
        'script',
        'style',
        'img',
        'svg',
        'path',
        'canvas',
        'iframe',
        'video',
        'audio',
      ],
    }).where('hidden', '<>', true)).filter(s => s.content.trim())

    const sectionIds = sections.map(s => s.id)

    const deleteds = await db
      .delete(vectorsTable)
      .where(notInArray(vectorsTable.sectionId, sectionIds))
      .returning({ sectionId: vectorsTable.sectionId })

    result.deleted = deleteds.length

    const existing = await db
      .select({
        sectionId: vectorsTable.sectionId,
        updatedAt: vectorsTable.updatedAt,
      })
      .from(vectorsTable)
      .where(inArray(vectorsTable.sectionId, sectionIds))

    const existingUpdatedAtMap = new Map(existing.map(v => [v.sectionId, v.updatedAt]))

    const shouldAddSections: ShouldProcessSectionItem[] = []
    const shouldUpdateSections: ShouldProcessSectionItem[] = []

    for (const section of sections) {
      const updatedAt = existingUpdatedAtMap.get(section.id)
      const postId = getPostId(section.id)
      const postUpdatedAt = postsMap.get(postId)?.updatedAt

      const createProcessSection = () => Object.assign(
        section,
        {
          postId,
          postTitle: postsMap.get(postId)?.title ?? '',
          postUpdatedAt: postsMap.get(postId)?.updatedAt,
          heading: section.titles?.at(-1) ?? null,
        },
      )

      if (!updatedAt) {
        shouldAddSections.push(createProcessSection())
      }
      else if (postUpdatedAt && new Date(postUpdatedAt) > new Date(updatedAt)) {
        shouldUpdateSections.push(createProcessSection())
      }
    }

    const shouldProcessSections = [...shouldAddSections, ...shouldUpdateSections]
    result.added = shouldAddSections.length
    result.updated = shouldUpdateSections.length
    result.skipped = sections.length - shouldProcessSections.length

    if (shouldProcessSections.length === 0)
      return result

    const values = shouldProcessSections.map((section) => {
      const parts = []

      if (section.postTitle)
        parts.push(`标题: ${section.postTitle}`)

      if (section.heading)
        parts.push(`章节: ${section.heading}`)

      parts.push(`内容: ${section.content}`)

      return parts.join('\n')
    })

    const { embeddings } = await embedMany({ model, values })

    const records = shouldProcessSections.map((section, i) => {
      const postId = getPostId(section.id)
      return {
        postId,
        sectionId: section.id,
        title: section.postTitle,
        heading: section.heading,
        content: values[i]!,
        embedding: embeddings[i]!,
        updatedAt: new Date(),
      }
    })

    await db.insert(vectorsTable)
      .values(records)
      .onConflictDoUpdate({
        target: vectorsTable.sectionId,
        set: {
          embedding: sql`EXCLUDED.embedding`,
          content: sql`EXCLUDED.content`,
          title: sql`EXCLUDED.title`,
          heading: sql`EXCLUDED.heading`,
          updatedAt: sql`EXCLUDED.updated_at`,
        },
      })

    return result
  })
})
