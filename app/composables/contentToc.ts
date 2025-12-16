import type { TemplateRef } from 'vue'

const SCROLL_OFFSET_HEIGHT = 180

export interface AnchorItem {
  id: string
  el: HTMLHeadElement
  hash: string
  level: number
  top: number
}

export function useContentToc(tocContainerRef: TemplateRef<HTMLElement>) {
  const activeAnchor = shallowRef<AnchorItem | null>(null)
  const indicatorState = reactive({
    top: '0',
    opacity: 0,
    height: '0',
  })

  let anchors: AnchorItem[] = []

  const setActiveAnchor = (anchor: AnchorItem | null) => {
    const tocContainer = unrefElement(tocContainerRef)
    if (!tocContainer)
      return

    if (!anchor) {
      activeAnchor.value = null
      indicatorState.top = '0'
      indicatorState.height = '0'
      indicatorState.opacity = 0
      return
    }

    const activeLink = tocContainer.querySelector(`a[href="${decodeURIComponent(anchor.hash)}"]`) as HTMLLinkElement
    if (activeLink) {
      activeAnchor.value = anchor
      indicatorState.top = `${activeLink.offsetTop}px`
      indicatorState.height = `${activeLink.offsetHeight - 16}px`
      indicatorState.opacity = 1
    }
  }

  const initialAnchors = () => {
    const scrollY = window.scrollY
    anchors = [...document.querySelectorAll('div[data-content-id] :where(h2,h3)')]
      .filter(el => el.id && el.hasChildNodes())
      .map(el => ({
        id: el.id,
        el: el as HTMLHeadElement,
        hash: `#${el.id}`,
        level: Number(el.tagName[1]),
        top: el.getBoundingClientRect().top + scrollY,
      }))
      .filter(({ top }) => !Number.isNaN(top))
      .sort((a, b) => a.top - b.top)
  }

  const scrollFn = () => {
    const scrollY = window.scrollY
    const innerHeight = window.innerHeight
    const offsetHeight = document.body.offsetHeight
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

    if (!anchors.length || scrollY < 1) {
      setActiveAnchor(null)
      return
    }

    if (isBottom) {
      setActiveAnchor(anchors[anchors.length - 1]!)
      return
    }

    let lastAnchor: AnchorItem
    for (const anchor of anchors) {
      if (anchor.top > scrollY + SCROLL_OFFSET_HEIGHT)
        break

      lastAnchor = anchor
    }
    setActiveAnchor(lastAnchor!)
  }

  const onScroll = useThrottleFn(scrollFn, 100)

  onMounted(() => {
    initialAnchors()
    requestAnimationFrame(scrollFn)
    useEventListener('scroll', onScroll)
  })

  return {
    activeAnchor,
    indicatorState,
  }
}
