<script setup lang="ts">
import { DarkIcon } from '~/components/icons'

const colorMode = useColorMode()

function switchTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function startViewTransition(event: MouseEvent) {
  if (!document.startViewTransition) {
    switchTheme()
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  const transition = document.startViewTransition(() => {
    switchTheme()
  })

  transition.ready.then(() => {
    const duration = 600
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'cubic-bezier(.76,.32,.29,.99)',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
}
</script>

<template>
  <ClientOnly>
    <Button
      class="rounded-full"
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      @click="startViewTransition"
    >
      <DarkIcon class="size-4.5 shrink-0" />
    </Button>
  </ClientOnly>
</template>
