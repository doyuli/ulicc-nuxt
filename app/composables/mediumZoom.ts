import type { MaybeRef } from 'vue'
import mediumZoom from 'medium-zoom'

let zoom: ReturnType<typeof mediumZoom> | null = null

export function useMediumZoom(targetRef: MaybeRef<HTMLElement>) {
  if (import.meta.server)
    return

  const zoom = getMediumZoom()

  watchPostEffect((onCleanup) => {
    const el = unrefElement(targetRef)
    if (!el || !zoom)
      return

    const img = el.tagName === 'IMG' ? el : el.querySelector('img')

    if (img) {
      zoom.attach(img)

      onCleanup(() => zoom?.detach(img))
    }
  })
}

export function getMediumZoom() {
  if (import.meta.server)
    return

  if (!zoom) {
    initialZoomStyle()
    zoom = mediumZoom({
      background: 'transparent',
    })
  }

  return zoom
}

function initialZoomStyle() {
  const innerHTML = `
    .medium-zoom-overlay {
      z-index: 50;
      --tw-backdrop-blur: blur(var(--blur-md, 12px));
      -webkit-backdrop-filter: var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      background-color: color-mix(in oklab, var(--color-black) 40%, transparent)!important;
    }
    .medium-zoom-image--opened {
      z-index: 51;
    }
  `
  useHead({
    style: [{ id: 'medium-zoom-bridge', innerHTML }],
  })
}
