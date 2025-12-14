<script setup lang="ts">
import { cn } from '~/lib/utils'

const { global, site } = useAppConfig()

const headers = [
  {
    label: '文库',
    href: '/',
  },
  {
    label: '专栏',
    href: '/',
  },
  {
    label: '友链',
    href: '/',
  },
]

const { y } = useWindowScroll({
  behavior: 'smooth',
})

const headerBgClass = computed(() => {
  return y.value > 50 ? 'bg-background border-b border-border' : 'bg-transparent border-b-0'
})

function scrollTop() {
  y.value = 0
}
</script>

<template>
  <header :class="cn('fixed w-full top-0 left-0 z-1000 h-(--header-height)', headerBgClass)">
    <div class="px-8 grid grid-cols-3 items-center mx-auto size-full" :style="{ maxWidth: global.pageMaxWidth }">
      <NuxtLink to="/">
        {{ site.title }}
      </NuxtLink>
      <div class="flex gap-8 items-center justify-center">
        <Button v-for="item in headers" :key="item.label" variant="ghost" as-child>
          <NuxtLink :to="item.href">
            {{ item.label }}
          </NuxtLink>
        </Button>
      </div>
      <div class="flex gap-4 items-center justify-end">
        <ColorMode />
        <ScrollMode :scroll-y="y" @scroll-top="scrollTop" />
      </div>
    </div>
  </header>
</template>
