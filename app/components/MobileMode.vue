<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import type { NavMenu } from './SiteNavigation.vue'
import { MenuIcon } from 'lucide-vue-next'
import { GithubIcon } from '~/components/icons'
import { cn } from '~/lib/utils'
import { msToDaysCeil } from '~/utils/date'
import { useConfigProviderContext } from './ConfigProvider.vue'

defineProps<{
  menus: NavMenu[]
  class?: HtmlHTMLAttributes['class']
}>()

const open = shallowRef(false)

const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate<{ link: NavMenu }>()

const { site, author } = useAppConfig()

const { posts } = useConfigProviderContext()

const siteMeta = computed(() => {
  const tags = [...new Set(posts.value?.map(post => post.tags ?? []).flat())]
  const since = new Date(site.since).getTime()
  const now = new Date().getTime()
  return [
    {
      label: '文章',
      value: posts.value?.length ?? 0,
    },
    {
      label: '标签',
      value: tags.length,
    },
    {
      label: '建站',
      value: msToDaysCeil(Math.max(0, now - since)),
    },
  ]
})
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button
        :class="cn('rounded-full', $props.class)"
        variant="outline"
        size="icon"
        aria-label="Search"
        @click="open = true"
      >
        <MenuIcon class="size-4.5 shrink-0" />
      </Button>
    </SheetTrigger>
    <SheetContent :show-close-button="false" class="w-75 h-[calc(100%-2rem)] right-4 top-1/2 -translate-y-1/2 bg-background/90 rounded-md">
      <SheetHeader class="sr-only">
        <SheetTitle>
          {{ site.title }}
        </SheetTitle>
        <SheetDescription>
          {{ site.description }}
        </SheetDescription>
      </SheetHeader>
      <div class="px-4 py-6 flex flex-col gap-4">
        <Card class="py-2 shadow-xs">
          <CardContent class="px-6 flex justify-between">
            <div v-for="(meta, i) in siteMeta" :key="i" class="flex flex-col items-start">
              <span class="text-xs text-muted-foreground">{{ meta.label }}</span>
              <span class="text-lg">{{ meta.value }}</span>
            </div>
          </CardContent>
        </Card>
        <DefineLinkTemplate v-slot="{ link }">
          <Button size="lg" variant="outline" as-child>
            <NuxtLink :to="link.href" @click="open = false">
              <component :is="link.icon" v-if="link.icon" class="size-4 shrink-0 text-muted-foreground" />
              <span>{{ link.label }}</span>
            </NuxtLink>
          </Button>
        </DefineLinkTemplate>
        <div v-for="menu in menus" :key="menu.label">
          <h4 class="mb-2 text-sm text-accent-foreground">
            {{ menu.label }}
          </h4>
          <div v-if="menu.children?.length" class="grid grid-cols-2 gap-4">
            <ReuseLinkTemplate v-for="child in menu.children" :key="child.label" :link="child" />
          </div>
          <ReuseLinkTemplate v-else class="w-full" :link="menu" />
        </div>
      </div>
      <SheetFooter class="flex-row justify-center gap-4">
        <Button
          class="rounded-full"
          variant="outline"
          size="icon"
          aria-label="Github"
        >
          <NuxtLink :to="author.github" target="_blank">
            <GithubIcon class="size-4.5 shrink-0" />
          </NuxtLink>
        </Button>
        <RandomPost @click="open = false" />
        <ColorMode />
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
