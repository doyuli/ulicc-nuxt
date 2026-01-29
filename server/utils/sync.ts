import type { PostsCollectionItem } from '@nuxt/content'
import { createHash } from 'node:crypto'

export interface PostsCollectionSectionItem {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
}
export type ShouldProcessSectionItem = ReturnType<typeof createProcessSection>

export const getPostId = (sectionId: string) => `posts${sectionId.split('#')[0]}.md`
export const calculateHash = (content: string) => createHash('md5').update(content).digest('hex')

export function createProcessSection(post: PostsCollectionItem, section: PostsCollectionSectionItem) {
  const postId = getPostId(section.id)
  const postTitle = post.title
  const heading = section.titles?.at(-1) ?? null
  return Object.assign(
    section,
    {
      postId,
      postTitle,
      postTags: post.tags,
      heading,
      contentHash: '',
      textToEmbed: '',
    },
  )
}

export function getTextToEmbed(section: ShouldProcessSectionItem) {
  const heading = section.titles?.at(-1) ?? null

  const parts = [`标题: ${section.postTitle}`]

  if (heading)
    parts.push(`章节: ${section.heading}`)

  if (section.postTags?.length)
    parts.push(`标签: ${section.postTags?.join(', ')}`)

  parts.push(`内容: ${section.content}`)

  return parts.join('\n')
}
