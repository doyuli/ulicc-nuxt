<script setup lang="ts">
import type { PostsCollectionItem } from '@nuxt/content'
import type { HTMLAttributes } from 'vue'
import { ArrowUpToLine, CalendarIcon, ClockIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { dateFormatter } from '~/utils/formatter'

const { posts = [], variant = 'default' } = defineProps<{
  posts?: PostsCollectionItem[]
  class?: HTMLAttributes['class']
  variant?: 'default' | 'simple'
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
      class="group bg-background shadow-(--card-shadow) hover:bg-background! hover:border-primary-light animate-fade-up"
      :style="{ animationDelay: `${0.2 + i * 0.1}s` }"
    >
      <NuxtLink :to="post.path">
        <ItemHeader v-if="variant === 'default'" class="justify-baseline gap-4 text-xs text-muted-foreground">
          <div class="flex items-center gap-1">
            <CalendarIcon class="size-3 shrink-0" />
            <span>{{ dateFormatter.custom(new Date(post.date), { dateStyle: 'medium' }) }}</span>
          </div>
          <div class="flex items-center gap-1 opacity-80">
            <ClockIcon class="size-3 shrink-0" />
            <span>{{ post.minRead }} min read</span>
          </div>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>
            <span class="text-lg group-hover:text-primary">{{ post.title }}</span>
            <Badge v-if="post.priority! >= 1000" variant="secondary">
              <ArrowUpToLine class="size-3" />
            </Badge>
          </ItemTitle>
          <ItemDescription>
            {{ post.description }}
          </ItemDescription>
        </ItemContent>
        <ItemFooter v-if="variant === 'default' && post.tags?.length" class="justify-baseline gap-2">
          <Badge
            v-for="tag in post.tags"
            :key="tag"
            variant="secondary"
            class="py-1 text-muted-foreground/80 text-xs rounded"
          >
            {{ tag }}
          </Badge>
        </ItemFooter>
      </NuxtLink>
    </Item>
  </ItemGroup>
</template>
