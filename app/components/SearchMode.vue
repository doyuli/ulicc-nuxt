<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { CornerDownLeft, SearchIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

defineProps<{
  class?: HtmlHTMLAttributes['class']
}>()

const open = shallowRef(false)

const { meta_k, ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k' && e.type === 'keydown')
      e.preventDefault()
  },
})

watch([meta_k, ctrl_k], ([_meta_k, _ctrl_k]) => {
  if (_meta_k || _ctrl_k)
    open.value = !open.value
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button
        :class="cn('rounded-full', $props.class)"
        variant="outline"
        size="icon"
        aria-label="Search"
        title="Search"
        @click="open = true"
      >
        <SearchIcon class="size-4.5 shrink-0" />
      </Button>
    </DialogTrigger>
    <DialogContent :show-close-button="false" class="rounded-md border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800">
      <DialogHeader class="sr-only">
        <DialogTitle>
          Search documentation
        </DialogTitle>
        <DialogDescription>
          Search documentation
        </DialogDescription>
      </DialogHeader>
      <SearchCommand @close="open = false" />
      <div class="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
        <div class="flex items-center gap-2">
          <kbd class="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3">
            <CornerDownLeft />
          </kbd>
          <span>Go to Page</span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
