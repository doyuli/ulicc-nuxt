<script setup lang="ts">
import { BotIcon, Loader2Icon, SendIcon, XIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const isOpen = shallowRef(false)
const inputText = shallowRef('')
const isTyping = shallowRef(false)

const messages = ref([
  {
    id: 1,
    role: 'bot',
    content: 'Hello! How can I help you today?',
  },
])

const target = useTemplateRef('target')

onClickOutside(target, () => {
  if (isOpen.value)
    isOpen.value = false
})

const inputRef = useTemplateRef<HTMLInputElement>('input')

const { focused } = useFocus(inputRef)
watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    focused.value = true
  }
})

function handleSubmit() {}
</script>

<template>
  <div ref="target" class="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="scale-90 opacity-0 translate-y-8"
      enter-to-class="scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="scale-100 opacity-100 translate-y-0"
      leave-to-class="scale-90 opacity-0 translate-y-8"
    >
      <Card v-if="isOpen" class="py-0 flex flex-col gap-0 w-[calc(100vw-3rem)] sm:w-96 mb-4 h-[500px] shadow-2xl pointer-events-auto">
        <CardHeader class="py-3 flex items-center justify-between bg-muted">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-sm font-medium tracking-tight">SiteAssistant</span>
          </div>
          <button class="text-muted-foreground transition-colors" @click="isOpen = false">
            <XIcon class="size-4" />
          </button>
        </CardHeader>
        <CardContent class="flex-1 overflow-y-auto p-4 space-y-4">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')"
          >
            <div
              :class="cn(
                'px-4 py-2 rounded-2xl text-sm max-w-[85%]',
                msg.role === 'user' ? 'bg-primary-light text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none',
              )"
            >
              <span>{{ msg.content }}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter class="py-3! border-t">
          <form class="relative w-full flex items-center gap-2" @submit.prevent="handleSubmit">
            <Input
              ref="input"
              v-model="inputText"
              type="text"
              placeholder="Ask about articles..."
              class="flex-1 bg-muted/30 border rounded-full py-2.5 pl-4 pr-12 text-sm ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/20"
            />
            <Button
              size="icon"
              type="submit"
              :disabled="!inputText.trim() || isTyping"
              class="absolute size-7 right-1.5 p-1.5 bg-primary text-white rounded-full"
            >
              <Loader2Icon v-if="isTyping" class="size-3 animate-spin" />
              <SendIcon v-else class="size-3" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </Transition>

    <button
      :class="cn(
        'group flex items-center justify-center size-14 shadow-lg hover:shadow-xl transform hover:-translate-y-1 pointer-events-auto transition-all duration-500 rounded-full',
        isOpen ? 'bg-card text-secondary-foreground border' : 'bg-primary text-primary-foreground',
      )"
      aria-label="Toggle Assistant"
      @click="isOpen = !isOpen"
    >
      <BotIcon :class="cn('size-6 absolute transition-all duration-500 ease-in-out', isOpen ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100')" />
      <XIcon :class="cn('size-6 absolute transition-all duration-500 ease-in-out', isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0')" />
    </button>
  </div>
</template>
