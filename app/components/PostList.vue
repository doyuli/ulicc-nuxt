<script setup lang="ts">
import type { PostsCollectionItem } from '@nuxt/content'
import type { HTMLAttributes } from 'vue'
import { ArrowUpToLine, CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { dateFormatter } from '~/utils/formatter'

const { posts = [] } = defineProps<{
  posts?: PostsCollectionItem[]
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <ItemGroup :class="cn('gap-4', $props.class)">
    <Item
      v-for="(post, i) in posts"
      :key="post.id"
      variant="outline"
      as-child
      role="listitem"
      class="bg-background animate-fade-up"
      :style="{ animationDelay: `${0.2 + i * 0.1}s` }"
    >
      <NuxtLink :to="post.path">
        <ItemContent>
          <ItemTitle>
            <span class="text-lg">{{ post.title }}</span>
            <Badge v-if="post.priority! >= 1000" variant="secondary">
              <ArrowUpToLine class="size-3" />
            </Badge>
          </ItemTitle>
          <ItemDescription>
            {{ post.description }}
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <div class="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <CalendarIcon class="size-3" />
            <span>{{ dateFormatter.custom(new Date(post.date), { dateStyle: 'medium' }) }}</span>
          </div>
        </ItemFooter>
      </NuxtLink>
    </Item>
  </ItemGroup>
</template>
