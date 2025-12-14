<script setup lang="ts">
import { randomInt } from '~/utils/random'

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

const { data } = useAsyncData('quote', () => $fetch<{ hitokoto: string }>('https://v1.hitokoto.cn/'))

const quote = computed(() => `「 ${data?.value?.hitokoto ?? fallback.value} 」`)
</script>

<template>
  <div>
    {{ quote }}
  </div>
</template>
