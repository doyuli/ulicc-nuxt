<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from '~/components/icons'
import { cn } from '~/lib/utils'

interface AudioMeta {
  author: string
  lrc: string
  pic: string
  title: string
  url: string
}

interface AplayerOptions {
  container: HTMLElement
  fixed: boolean
  mini: boolean
  autoplay: boolean
  theme: string
  loop: 'all' | 'one' | 'none'
  order: 'list' | 'random'
  preload: 'none' | 'metadata' | 'auto'
  volume: number
  mutex: boolean
  listFolded: boolean
  listMaxHeight: number
  lrcType: 0 | 1 | 2 | 3
  audio: AudioMeta[]
  storageName: string
}

type Props = {
  id?: string
  server?: 'netease' | 'tencent' | 'xiami'
  type?: 'song' | 'album' | 'artist' | 'playlist'
  class?: HtmlHTMLAttributes['class']
} & Partial<Omit<AplayerOptions, 'container' | 'audio'>>

const props = withDefaults(
  defineProps<Props>(),
  {
    id: '7452421335',
    server: 'netease',
    type: 'playlist',
    theme: 'var(--color-primary-light)',
    preload: 'none',
    order: 'random',
    lrcType: 3,
    loop: 'all',
    mutex: true,
    storageName: 'ULICC_PLAYER',
  },
)

const emits = defineEmits<{
  (e: 'ready'): void
  (e: 'error', error: any): void
}>()

// TODO: Refactoring with Vue 3, not relying on Aplayer
useHead({
  link: [{ rel: 'stylesheet', href: '/player/aplayer.min.css' }],
  script: [{ src: '/player/aplayer.min.js' }],
})

const PLAYER_SERVER_API = 'https://api.i-meto.com/meting/api'

const { data } = useFetch<AudioMeta[]>(
  PLAYER_SERVER_API,
  {
    query: {
      server: props.server,
      type: props.type,
      id: props.id,
    },
    default: () => [],
  },
)

const target = useTemplateRef('target')
const isPlaying = shallowRef(false)
let ap: any = null

function playToggle() {
  if (ap)
    ap.toggle()
}

function playSkipBack() {
  if (ap)
    ap.skipBack()
}

function playSkipForward() {
  if (ap)
    ap.skipForward()
}

watchPostEffect((onCleanup) => {
  if (import.meta.server)
    return
  if (!data.value?.length)
    return

  const APlayer = (window as any).APlayer

  ap = new APlayer({
    container: target.value,
    audio: data.value,
    ...toValue(props),
  })

  ap.on('play', () => (isPlaying.value = true))
  ap.on('pause', () => (isPlaying.value = false))
  ap.on('error', (e: any) => emits('error', e))
  ap.on('loadstart', () => emits('ready'))

  onCleanup(() => {
    ap?.destroy()
  })
})
</script>

<template>
  <div
    id="player-container"
    :class="cn(
      'group fixed bottom-6 left-6 z-50 flex items-center origin-bottom-left rounded-full shadow-sm border select-none overflow-hidden transition-all duration-500',
      isPlaying && 'playing',
      $props.class,
    )"
  >
    <div
      :class="cn(
        'absolute inset-0 text-sm flex items-center gap-3 text-white opacity-0 z-2',
        'group-hover:opacity-100',
        isPlaying ? 'justify-end pr-4 bg-linear-to-l from-primary-light/90 via-primary-light/70 to-transparent' : 'justify-center bg-primary-light/80 backdrop-blur-md',
      )"
    >
      <button v-if="isPlaying" class="size-6 shrink-0 hover:scale-110 transition-transform" aria-label="Previous track" @click="playSkipBack">
        <PrevIcon class="size-6" />
      </button>
      <button :aria-label="isPlaying ? 'Pause' : 'Play'" class="size-6 shrink-0 hover:scale-110 transition-transform" @click="playToggle">
        <component :is="isPlaying ? PauseIcon : PlayIcon" class="size-6" />
      </button>
      <button v-if="isPlaying" class="size-6 shrink-0 hover:scale-110 transition-transform" aria-label="Next track" @click="playSkipForward">
        <NextIcon class="size-6" />
      </button>
    </div>
    <div ref="target" />
  </div>
</template>

<style>
#player-container {
  --player-height: 42px;
  --player-background: var(--color-background);
  --player-progress: #ffffff;
  --player-lrc: #ffffffb3;
  --player-lrc-active: #ffffff;
  --player-foreground: var(--color-secondary-foreground);
  --player-border: var(--color-border);
  --player-border-radius: 99px;

  --player-active-background: color-mix(in oklab, var(--color-primary) 85%, white);

  .aplayer {
    display: flex;
    margin: 0;
    height: var(--player-height);
    transition: 0.3s all;
    background: var(--player-background);
    border: 1px solid var(--player-border);
    border-radius: var(--player-border-radius);
    box-shadow: none;
    pointer-events: none;
  }

  .aplayer .aplayer-notice,
  .aplayer .aplayer-miniswitcher,
  .aplayer-list,
  .aplayer .aplayer-info .aplayer-controller .aplayer-time,
  .aplayer .aplayer-info .aplayer-music .aplayer-author,
  .aplayer .aplayer-pic div,
  .aplayer .aplayer-lrc:after,
  .aplayer .aplayer-lrc:before,
  .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded {
    display: none;
  }

  .aplayer .aplayer-body {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 8px;
    padding-right: 12px;
  }

  .aplayer .aplayer-pic .aplayer-play {
    opacity: 0;
  }

  .aplayer .aplayer-info .aplayer-music {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    z-index: 1;
  }

  .aplayer.aplayer-withlist .aplayer-info {
    border: none;
  }

  .aplayer .aplayer-info .aplayer-music .aplayer-title {
    display: inline-block;
    max-width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    transition: 0.3s all;
  }

  .aplayer .aplayer-info .aplayer-controller {
    position: absolute;
    inset: 0;
  }

  .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap {
    margin: 0;
    padding: 0;
  }

  .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
    height: 100%;
    opacity: 0;
    background: 0 0;
  }

  .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played {
    height: 100%;
    opacity: 0.1;
    background-color: var(--player-progress) !important;
    animation: ambient-flicker 5s ease infinite;
    animation-play-state: paused;
  }

  .aplayer.aplayer-withlrc .aplayer-lrc {
    margin-left: 8px;
    margin-top: -2px;
    width: 0;
    opacity: 0;
    transition: 0.3s all;
  }

  .aplayer .aplayer-lrc p {
    color: var(--player-lrc);
    filter: blur(0.8px);
  }

  .aplayer .aplayer-lrc p.aplayer-lrc-current {
    color: var(--player-lrc-active);
    filter: blur(0);
    border: none;
  }

  .aplayer.aplayer-withlrc .aplayer-pic {
    position: relative;
    height: 25px;
    width: 25px;
    border-radius: 40px;
    z-index: 1;
    transition: 0.3s all;
    transform: rotate(0) scale(1);
    border: 1px solid var(--player-border);
    box-shadow: 0 0 12px #ffffffa6;
    animation: album-rotate 24s linear infinite;
    animation-play-state: paused;
  }

  .aplayer.aplayer-withlrc .aplayer-info {
    display: flex;
    align-items: center;
    padding: 0;
    margin-left: 12px;
    color: var(--player-foreground);
    height: 100%;
  }

  &.playing {
    .aplayer {
      background: var(--player-active-background);
      backdrop-filter: saturate(180%) blur(20px);
      backdrop-filter: blur(20px);
      transform: translateZ(0);
    }

    .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
      opacity: 1;
    }

    .aplayer.aplayer-withlrc .aplayer-lrc {
      margin-bottom: 0;
      width: 200px;
      opacity: 1;
    }

    .aplayer.aplayer-withlrc .aplayer-pic,
    .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played {
      animation-play-state: running;
    }

    .aplayer.aplayer-withlrc .aplayer-info {
      color: var(--player-lrc-active);
    }
  }
}

@keyframes album-rotate {
  from {
    transform: rotate(0) scale(1.1);
  }
  to {
    transform: rotate(360deg) scale(1.1);
  }
}

@keyframes ambient-flicker {
  0%,
  100% {
    opacity: 0.1;
    transform: translateX(0);
  }
  50% {
    opacity: 0.25;
    transform: translateX(1px);
  }
}
</style>
