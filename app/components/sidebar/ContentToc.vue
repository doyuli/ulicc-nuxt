<script setup lang="ts">
import type { TocLink } from '@nuxt/content'
import { TocIcon } from '~/components/icons'
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
      <TocIcon class="size-4 shrink-0" />
      <span>目录</span>
    </CardHeader>
    <CardContent>
      <div ref="toc-container" class="relative max-h-[calc(70vh-58px)] overflow-y-auto">
        <div
          class="absolute left-0 my-2 w-1 bg-primary-light rounded-md transition-[top] duration-200"
          :style="{
            top: indicatorState.top,
            opacity: indicatorState.opacity,
            height: indicatorState.height,
          }"
        />
        <DefineListTemplate v-slot="{ links, level }">
          <ul :class="cn(level === 0 && 'pl-4 border-l-4 border-accent', level > 0 && 'pl-2 text-sm')">
            <li v-for="link in links" :key="link.id" class="list-none my-0.5">
              <a
                :class="cn('flex p-1.5 text-muted-foreground hover:bg-accent hover:text-primary-light rounded-md transition', activeAnchor?.id === link.id && 'bg-accent text-foreground')"
                :href="`#${link.id}`"
              >
                <span class="min-w-0 truncate">{{ link.text }}</span>
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
