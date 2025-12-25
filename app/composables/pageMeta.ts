import type { UseSeoMetaInput } from '@unhead/vue'

export function usePageMeta(playload: UseSeoMetaInput) {
  const { site } = useAppConfig()
  const { title = site.title, description = site.description, ...rest } = playload

  useSeoMeta({
    title,
    description,
    ogTitle: title as string,
    ogDescription: description,
    ...rest,
  })
}
