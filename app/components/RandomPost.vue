<script setup lang="ts">
import { Dice5Icon } from 'lucide-vue-next'
import { randomInt } from '~/utils/random'
import { useConfigProviderContext } from './ConfigProvider.vue'

const { posts } = useConfigProviderContext()
const router = useRouter()

function goToRandomPost() {
  if (!posts.value?.length)
    return
  const random = posts.value[randomInt(0, posts.value.length - 1)]!
  router.push(random.path)
}
</script>

<template>
  <Button
    class="rounded-full"
    variant="outline"
    size="icon"
    aria-label="Random Post"
    @click="goToRandomPost"
  >
    <Dice5Icon class="size-4.5 shrink-0" />
  </Button>
</template>
