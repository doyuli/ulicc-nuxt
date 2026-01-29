import type { PostsCollectionItem } from '@nuxt/content'
import type { ShouldProcessSectionItem } from '~~/server/utils/sync'
import { queryCollection, queryCollectionSearchSections } from '@nuxt/content/server'
import { embedMany } from 'ai'
import { inArray, notInArray, sql } from 'drizzle-orm'
import { vectorsTable } from '~~/server/db/schema'
import { calculateHash, createProcessSection, getPostId, getTextToEmbed } from '~~/server/utils/sync'

export default defineLazyEventHandler(async () => {
  const siliconflow = useSiliconflow()
  const model = siliconflow.embedding('Qwen/Qwen3-Embedding-0.6B')
  const db = useDb()
  const BATCH_SIZE = 20

  return defineEventHandler(async (event) => {
    await requireUserSession(event)

    const result = { total: 0, added: 0, updated: 0, skipped: 0, deleted: 0 }

    const posts = await queryCollection(event, 'posts')
      .where('hidden', '<>', true)
      .select('id', 'title', 'tags')
      .all()

    if (!posts.length) {
      const deleteds = await db
        .delete(vectorsTable)
        .returning({ sectionId: vectorsTable.sectionId })

      result.deleted = deleteds.length
      return result
    }

    const postsMap = new Map(posts.map(p => [p.id, p]))

    const sections = (await queryCollectionSearchSections(event, 'posts', {
      ignoredTags: [
        'script',
        'style',
        'img',
        'svg',
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
        contentHash: vectorsTable.contentHash,
      })
      .from(vectorsTable)
      .where(inArray(vectorsTable.sectionId, sectionIds))

    const existingHashMap = new Map(existing.map(v => [v.sectionId, v.contentHash]))

    const shouldProcessSections: (ShouldProcessSectionItem & {
      action: 'update' | 'add'
    })[] = []

    for (const section of sections) {
      const postId = getPostId(section.id)
      const processSection = createProcessSection(
        postsMap.get(postId) as PostsCollectionItem,
        section,
      )

      const textToEmbed = getTextToEmbed(processSection)
      processSection.textToEmbed = textToEmbed
      processSection.contentHash = calculateHash(textToEmbed)

      const existingHash = existingHashMap.get(section.id)
      if (existingHash === processSection.contentHash)
        continue

      shouldProcessSections.push({
        ...processSection,
        action: existingHash ? 'update' : 'add',
      })
    }

    result.total = sections.length
    result.skipped = sections.length - shouldProcessSections.length

    for (let i = 0; i < shouldProcessSections.length; i += BATCH_SIZE) {
      const batch = shouldProcessSections.slice(i, i + BATCH_SIZE)
      const values = batch.map(s => s.textToEmbed)

      const { embeddings } = await embedMany({ model, values })

      const records = batch.map((item, idx) => ({
        postId: item.postId,
        sectionId: item.id,
        title: item.postTitle,
        heading: item.heading,
        content: values[idx],
        embedding: embeddings[idx],
        contentHash: item.contentHash,
        updatedAt: new Date(),
      }))

      await db.insert(vectorsTable).values(records).onConflictDoUpdate({
        target: vectorsTable.sectionId,
        set: {
          embedding: sql`EXCLUDED.embedding`,
          content: sql`EXCLUDED.content`,
          title: sql`EXCLUDED.title`,
          heading: sql`EXCLUDED.heading`,
          contentHash: sql`EXCLUDED.content_hash`,
          updatedAt: sql`EXCLUDED.updated_at`,
        },
      })

      batch.forEach(b => b.action === 'add' ? result.added++ : result.updated++)
    }

    return result
  })
})
