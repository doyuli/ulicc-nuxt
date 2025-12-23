<script setup lang="ts">
import { ChevronRight, FileText, SearchIcon } from 'lucide-vue-next'

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
function navigateAndClose(path: string) {
  open.value = false
  router.push(path)
}

const { ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown')
      e.preventDefault()
  },
})

watchEffect(() => {
  if (ctrl_k?.value)
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
      <DialogContent :show-close-button="false" class="rounded-md p-0 border-none">
        <DialogHeader class="sr-only">
          <DialogTitle>
            Search documentation
          </DialogTitle>
          <DialogDescription>
            Search documentation
          </DialogDescription>
        </DialogHeader>
        <Command class="rounded-lg border shadow-md md:min-w-[500px]">
          <CommandInput placeholder="Search documentation..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <template v-for="(value, key) in navigation" :key="key">
              <CommandGroup v-for="nav in value" :key="nav.stem" :heading="nav.title">
                <CommandItem v-for="child in nav.children" :key="child.stem" :value="child.title" @select="navigateAndClose(child.path)">
                  <FileText class="size-4 shrink-0 text-muted-foreground" />
                  <span class="truncate">{{ child.title }}</span>
                </CommandItem>
              </CommandGroup>
            </template>
            <CommandGroup heading="Sections">
              <CommandItem v-for="section in sections" :key="section.id" :value="`${section.title}${section.content}`" @select="navigateAndClose(section.id)">
                <FileText class="size-4 shrink-0 text-muted-foreground" />
                <span class="truncate flex items-center gap-0.5">
                  <span>{{ section.title }}</span>
                  <ChevronRight v-if="section.content " class="size-3 shrink-0 text-muted-foreground" />
                  <span class="flex-1 truncate text-muted-foreground">{{ section.content }}</span>
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  </ClientOnly>
</template>
