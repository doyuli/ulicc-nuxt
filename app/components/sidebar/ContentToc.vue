<script setup lang="ts">
import type { TocLink } from '@nuxt/content'
import { Icon } from '@iconify/vue'
import { cn } from '~/lib/utils'

const { links = [] } = defineProps<{
  links?: TocLink[]
}>()

const [DefineListTemplate, ReuseListTemplate] = createReusableTemplate<{ links: TocLink[], level: number }>()
</script>

<template>
  <Card>
    <CardHeader class="flex items-center gap-1 text-secondary-foreground">
      <Icon icon="material-symbols:list-alt-rounded" />
      <span>目录</span>
    </CardHeader>
    <CardContent class="max-h-[calc(70vh-58px)] overflow-y-auto">
      <DefineListTemplate v-slot="{ links, level }">
        <ul :class="cn(level > 0 && 'ml-4 text-sm')">
          <li v-for="link in links" :key="link.id" class="list-none">
            <a class="flex p-1.5 text-muted-foreground hover:bg-accent rounded-md" :href="`#${link.id}`">
              <span>{{ link.text }}</span>
            </a>
            <ReuseListTemplate v-if="link.children?.length" :links="(link.children)" :level="level + 1" />
          </li>
        </ul>
      </DefineListTemplate>

      <ReuseListTemplate :links="links" :level="0" />
    </CardContent>
  </Card>
</template>
