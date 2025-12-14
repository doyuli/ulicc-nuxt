<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <SiteHeader />
  <main class="px-8 py-16 mx-auto" :style="{ maxWidth: global.pageMaxWidth }">
    <slot />
  </main>
</template>
