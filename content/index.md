# Welcome to Nuxt Content Starter

This is the main page displaying Markdown located at [content/index.md](https://github.com/nuxt/starter/blob/content/content/index.md).

Move to [about](/about) page.

```vue
<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
```

## Manage your Contents

```bash
pnpm install @nuxt/content
```

Create new pages or modify the existing ones in `content/` directory.

## Query & Render Pages

You can find an example of querying contents and rendering them in a [catch-all page](https://github.com/nuxt/starter/blob/content/app/pages/%5B...slug%5D.vue)

## Integrate Vue Component

::alert{color="green"}
The current [alert](https://github.com/nuxt/starter/blob/content/app/components/Alert.vue) and the [counter](https://github.com/nuxt/starter/blob/content/app/components/Counter.vue) below are `Vue` components integrated into the Markdown.
::

::counter
::

Checkout out the [documentation](https://content.nuxt.com/docs/getting-started) to learn more.
