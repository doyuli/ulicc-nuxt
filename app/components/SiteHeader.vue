<script setup lang="ts">
import { navigation } from '~/constants/navigation'
import { cn } from '~/lib/utils'

const { global, site } = useAppConfig()

const { y, directions, isScrolling } = useWindowScroll({
  behavior: 'smooth',
})

const isScrollingDown = shallowRef(false)

watchEffect(() => {
  if (!isScrolling.value)
    return

  if (directions.bottom)
    isScrollingDown.value = true
  else
    isScrollingDown.value = false
})

const headerBgClass = computed(() => {
  return y.value > 50 ? 'bg-background border-b border-border' : 'bg-transparent border-b-0'
})

function scrollTop() {
  y.value = 0
}
</script>

<template>
  <header :class="cn('fixed w-full top-0 left-0 z-10 h-(--header-height)', headerBgClass)">
    <div :class="cn('grid grid-cols-3 items-center mx-auto size-full', global.appShellClass)">
      <NuxtLink class="font-bold opacity-90" to="/">
        {{ site.title }}
      </NuxtLink>
      <div class="flex items-center justify-center size-full overflow-hidden">
        <div
          :class="cn(
            'flex flex-col items-center h-[200%] w-full transition-transform duration-500',
            isScrollingDown ? '-translate-y-1/4' : 'translate-y-1/4',
          )"
        >
          <div class="h-1/2 w-full flex items-center justify-center">
            <SiteNavigation :menus="navigation" />
          </div>
          <div class="h-1/2 w-full flex items-center justify-center">
            <span class="truncate whitespace-nowrap font-medium text-sm">
              {{ site.description }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-center justify-end">
        <SearchMode />
        <ColorMode />
        <ScrollMode :scroll-y="y" @scroll-top="scrollTop" />
      </div>
    </div>
  </header>
</template>
