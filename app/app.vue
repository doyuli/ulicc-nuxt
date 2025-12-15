<script setup lang="ts">
const { site: { title, description } } = useAppConfig()

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <ConfigProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ArtPlum />
  </ConfigProvider>
</template>
