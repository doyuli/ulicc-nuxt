<script setup lang="ts">
import { ChevronRight, CornerDownLeft, FileText, LinkIcon, SearchIcon, SquareChevronRight } from 'lucide-vue-next'
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const { tools } = useConfigProviderContext()
const allLinks = computed(() => tools.value?.flatMap(v => v.links) ?? [])

const { data: sections } = await useAsyncData('search-sections', async () => {
  const [posts, snippets] = await Promise.all([
    queryCollectionSearchSections('posts'),
    queryCollectionSearchSections('snippets'),
  ])
  return [
    ...posts.map(v => ({ ...v, type: 'post' })),
    ...snippets.map(v => ({ ...v, type: 'snippet' })),
  ].filter(v => v.level !== 1)
})

const { data: navigation } = await useAsyncData('search-navigations', async () => {
  const [posts, snippets] = await Promise.all([
    queryCollectionNavigation('posts'),
    queryCollectionNavigation('snippets'),
  ])
  return { posts, snippets }
})

const open = shallowRef(false)
const router = useRouter()
function navigateAndClose(path: string, _blank = false) {
  open.value = false
  if (_blank)
    return window.open(path, '_blank')

  router.push(path)
}

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
  <ClientOnly>
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button
          class="rounded-full"
          variant="outline"
          size="icon"
          aria-label="Search"
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
        <Command class="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border">
          <CommandInput placeholder="Search documentation..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <template v-for="(value, key) in navigation" :key="key">
              <CommandGroup v-for="nav in value" :key="nav.stem" :heading="nav.title">
                <CommandItem v-for="child in nav.children" :key="child.stem" :value="child.title" @select="navigateAndClose(child.path)">
                  <component :is="key === 'posts' ? FileText : SquareChevronRight" class="size-4 shrink-0 text-muted-foreground" />
                  <span class="truncate">{{ child.title }}</span>
                </CommandItem>
              </CommandGroup>
            </template>
            <CommandGroup heading="Tools">
              <CommandItem v-for="(link, i) in allLinks" :key="i" :value="`${link.name}${link.description}`" @select="navigateAndClose(link.href, true)">
                <LinkIcon class="size-4 shrink-0 text-muted-foreground" />
                <span class="truncate flex items-center gap-0.5">
                  <span>{{ link.name }}</span>
                  <ChevronRight v-if="link.description " class="size-3 shrink-0 text-muted-foreground" />
                  <span class="flex-1 truncate text-muted-foreground">{{ link.description }}</span>
                </span>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Sections">
              <CommandItem v-for="section in sections" :key="section.id" :value="`${section.title}${section.content}`" @select="navigateAndClose(section.id)">
                <component :is="section.type === 'post' ? FileText : SquareChevronRight" class="size-4 shrink-0 text-muted-foreground" />
                <span class="truncate flex items-center gap-0.5">
                  <span>{{ section.title }}</span>
                  <ChevronRight v-if="section.content " class="size-3 shrink-0 text-muted-foreground" />
                  <span class="flex-1 truncate text-muted-foreground">{{ section.content }}</span>
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
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
  </ClientOnly>
</template>
