<script setup lang="ts">
const { site: { title, description } } = useAppConfig()

usePageMeta({
  title,
  description,
  titleTemplate: `%s - ${title.toLocaleUpperCase()}`,
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
