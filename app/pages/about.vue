<script setup lang="ts">
const route = useRoute()

const { data: about } = await useAsyncData('about', () => {
  return queryCollection('about').path(route.path).first()
})

if (!about.value) {
  throw createError({ statusCode: 404, statusMessage: 'About not found', fatal: true })
}
</script>

<template>
  <div class="py-8">
    <ContentRenderer v-if="about" :value="about" />
  </div>
</template>
