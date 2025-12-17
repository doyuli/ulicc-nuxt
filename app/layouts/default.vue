<script setup lang="ts">
import { cn } from '~/lib/utils'

const { global } = useAppConfig()
</script>

<template>
  <SiteHeader />
  <main :class="cn('py-16 mx-auto', global.appShellClass)">
    <slot />
  </main>
  <SiteFooter />
</template>
