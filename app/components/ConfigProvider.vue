<script lang="ts">
import type { PostsCollectionItem } from '@nuxt/content'

interface ConfigProviderContext {
  globalTime: Ref<Date>
  posts: Ref<PostsCollectionItem[] | undefined>
  tags: ComputedRef<Record<string, PostsCollectionItem[]>>
}

const [useConfigProviderContext, provideConfigProviderContext] = createContext<ConfigProviderContext>('ConfigProvider')

export {
  useConfigProviderContext,
}
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const globalTime = useNow({ interval: 60 * 1000 })

const { data: posts } = await useAsyncData('posts-all', () => {
  return queryCollection('posts')
    .order('priority', 'DESC')
    .order('date', 'DESC')
    .all()
})

const tags = computed(() => {
  const result: Record<string, Set<PostsCollectionItem>> = {}
  posts.value?.forEach((post) => {
    post.tags?.forEach((t) => {
      (result[t] ??= new Set()).add(post)
    })
  })
  return Object.fromEntries(
    Object.entries(result).map(([tag, postSet]) => [tag, Array.from(postSet)]),
  )
})

provideConfigProviderContext({
  globalTime,
  posts,
  tags,
})
</script>

<template>
  <slot />
</template>
