<script setup lang="ts">
import { cn } from '~/lib/utils'

const { global } = useAppConfig()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <SiteHeader />
    <main :class="cn('flex-1 py-16 mx-auto', global.appShellClass)">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
