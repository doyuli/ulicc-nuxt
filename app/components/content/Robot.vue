<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { RobotIcon } from '~/components/icons'
import { cn } from '~/lib/utils'

const props = defineProps<{
  text: string
  class?: HtmlHTMLAttributes['class']
}>()

const isTyping = shallowRef(false)
const displayText = shallowRef('')
let timer: any

function startTyping(targetText: string) {
  isTyping.value = true
  displayText.value = ''
  let currentIndex = 0

  const step = () => {
    if (currentIndex >= targetText.length) {
      isTyping.value = false
      return
    }

    displayText.value += targetText.charAt(currentIndex++)

    const delay = Math.random() * (120 - 40) + 40
    timer = setTimeout(step, delay)
  }

  step()
}

function stopTyping() {
  if (timer)
    clearTimeout(timer)

  isTyping.value = false
}

onMounted(() => {
  watch(
    () => props.text,
    (text, _, onCleanup) => {
      text && startTyping(text)

      onCleanup(stopTyping)
    },
    { immediate: true },
  )
})

function handleReTyped() {
  stopTyping()
  startTyping(props.text)
}
</script>

<template>
  <Card :class="cn('bg-primary-light/2 gap-3', $props.class)">
    <CardHeader class="flex justify-between items-center">
      <div class="flex items-center gap-1 text-primary font-bold">
        <RobotIcon class="size-5 shrink-0" />
        <span>文章摘要</span>
        <ChevronRight class="size-4 shrink-0" />
      </div>
      <Button
        :class="cn('font-bold text-xs h-6 px-3 bg-primary-light rounded-full hover:opacity-70', isTyping && 'animate-blink')"
        :disabled="isTyping"
        @click="handleReTyped"
      >
        FakeGPT
      </Button>
    </CardHeader>
    <CardContent>
      <Card class="rounded-2xl">
        <CardContent>
          {{ displayText || '正在思考...' }}
          <span v-if="isTyping" class="mr-1 text-primary animate-blink">|</span>
        </CardContent>
      </Card>
    </CardContent>
    <CardFooter>
      <span class="text-xs text-muted-foreground">此内容根据文章生成，并经过人工审核，仅用于文章内容的解释与总结</span>
    </CardFooter>
  </Card>
</template>
