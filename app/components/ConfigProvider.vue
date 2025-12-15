<script lang="ts">
interface ConfigProviderContext {
  globalTime: Ref<Date>
}

const [useConfigProviderContext, provideConfigProviderContext] = createContext<ConfigProviderContext>('ConfigProvider')

export {
  useConfigProviderContext,
}
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const globalTime = useNow({ interval: 60 * 1000 })

provideConfigProviderContext({
  globalTime,
})
</script>

<template>
  <slot />
</template>
