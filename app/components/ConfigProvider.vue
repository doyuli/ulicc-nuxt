<script lang="ts">
import type { PostsCollectionItem } from '@nuxt/content'

interface ConfigProviderContext {
  globalTime: Ref<Date>
  posts: Ref<PostsCollectionItem[] | undefined>
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

provideConfigProviderContext({
  globalTime,
  posts,
})
</script>

<template>
  <slot />
</template>
