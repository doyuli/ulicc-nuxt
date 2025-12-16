<script setup lang="ts">
import type { TocLink } from '@nuxt/content'
import { Icon } from '@iconify/vue'
import { cn } from '~/lib/utils'

const { links = [] } = defineProps<{
  links?: TocLink[]
}>()

const [DefineListTemplate, ReuseListTemplate] = createReusableTemplate<{ links: TocLink[], level: number }>()

const tocContainerRef = useTemplateRef<HTMLElement>('toc-container')

const { activeAnchor, indicatorState } = useContentToc(tocContainerRef)
</script>

<template>
  <Card>
    <CardHeader class="flex items-center gap-1 text-secondary-foreground">
      <Icon icon="material-symbols:list-alt-rounded" />
      <span>目录</span>
    </CardHeader>
    <CardContent class="relative">
      <div
        class="absolute left-4 w-1 bg-primary rounded-md transition-all duration-300"
        :style="{
          top: indicatorState.top,
          opacity: indicatorState.opacity,
          height: indicatorState.height,
        }"
      />
      <div ref="toc-container" class="pl-4 max-h-[calc(70vh-58px)] overflow-y-auto border-l-4 border-accent">
        <DefineListTemplate v-slot="{ links, level }">
          <ul :class="cn(level > 0 && 'ml-4 text-sm')">
            <li v-for="link in links" :key="link.id" class="list-none">
              <a
                :class="cn('flex p-1.5 text-muted-foreground hover:bg-accent hover:text-primary rounded-md truncate', activeAnchor?.id === link.id && 'bg-accent')"
                :href="`#${link.id}`"
              >
                <span>{{ link.text }}</span>
              </a>
              <ReuseListTemplate v-if="link.children?.length" :links="(link.children)" :level="level + 1" />
            </li>
          </ul>
        </DefineListTemplate>

        <ReuseListTemplate :links="links" :level="0" />
      </div>
    </CardContent>
  </Card>
</template>
