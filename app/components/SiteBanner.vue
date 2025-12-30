<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'
import { randomInt } from '~/utils/random'

defineProps<{
  class?: HtmlHTMLAttributes['class']
}>()

const quotes = [
  '思君如流水，何有穷已时。',
  '世界灿烂盛大，欢迎回家。',
  '如果你看向我，我会温柔地消融，像火山中的雪。',
  '物质决定意识，意识反作用于物质。',
  '时间是存在者的时间。',
  '我忘记了所有悲剧，所见皆是奇迹。',
  '浮萍漂泊本无根，天涯游子君莫问。',
] as const

function getFallback() {
  return quotes[randomInt(0, quotes.length - 1)]
}

const fallback = useState('quote:fallback', () => getFallback())

const { data, refresh } = useAsyncData('quote', () => $fetch<{ hitokoto: string }>('https://v1.hitokoto.cn/'))

const quote = computed(() => `「 ${data?.value?.hitokoto ?? fallback.value} 」`)
</script>

<template>
  <div :class="cn('min-h-32 flex items-center justify-center', $props.class)">
    <Transition
      mode="out-in"
      enter-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-500"
      leave-to-class="opacity-0"
    >
      <span :key="quote" class="text-gray-600 dark:text-gray-300 font-light tracking-widest text-sm md:text-base text-center italic cursor-pointer" @click="() => refresh()">
        {{ quote }}
      </span>
    </Transition>
  </div>
</template>
