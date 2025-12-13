<script setup lang="ts">
import { ArrowUpToLine, CalendarIcon } from 'lucide-vue-next'
import { dateFormatter } from '~/utils/formatter'

const { data: posts } = await useAsyncData('posts-all', () => {
  return queryCollection('posts')
    .order('priority', 'DESC')
    .order('date', 'DESC')
    .all()
})
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <ItemGroup class="gap-4">
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
              <span>{{ post.title }}</span>
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
  </div>
</template>

<!-- <style>
@keyframes fade-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.6s 0.3s backwards;
}
</style> -->
