<script setup lang="ts">
import { TagIcon } from 'lucide-vue-next'
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'
import { cn } from '~/lib/utils'

const { tags } = useConfigProviderContext()

type Tags = keyof typeof tags.value

const selectedTag = shallowRef<Tags | null>(null)

const currentPosts = computed(() => selectedTag.value ? tags.value[selectedTag.value] : [])

function handleSelect(tag: Tags) {
  if (selectedTag.value === tag)
    selectedTag.value = null
  else
    selectedTag.value = tag
}

usePageMeta({
  title: '标签索引',
})
</script>

<template>
  <div class=" my-12 text-center">
    <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      标签索引
    </h1>
    <p class="mt-4 text-muted-foreground">
      目前共计 {{ Object.keys(tags).length }} 个分类标签
    </p>
  </div>
  <div class="flex flex-wrap justify-center gap-4 mb-8">
    <Button
      v-for="(postList, tagName) in tags"
      :key="tagName"
      size="lg"
      variant="outline"
      :class="cn('py-5', selectedTag === tagName && 'bg-primary/70 hover:bg-primary/70 text-white hover:text-white')"
      @click="handleSelect(tagName)"
    >
      <span>{{ tagName }}</span>
      <Badge variant="secondary">
        {{ postList.length }}
      </Badge>
    </Button>
  </div>
  <template v-if="currentPosts?.length">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">
        带有标签 “<span class="text-primary">{{ selectedTag }}</span>” 的文章
      </h2>
      <button class="text-sm text-muted-foreground hover:text-secondary-foreground" @click="selectedTag = null">
        清除筛选
      </button>
    </div>
    <PostList :posts="currentPosts" />
  </template>
  <div v-else class="flex  gap-2 justify-center items-center py-20 text-gray-400 bg-accent/30 border border-dashed border-muted rounded-md">
    <TagIcon class="size-5 shrink-0" />
    <h3 class="text-lg italic">
      选择一个标签以查看相关文章
    </h3>
  </div>
</template>
