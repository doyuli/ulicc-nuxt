import type { NavMenu } from '~/components/SiteNavigation.vue'
import { PencilRuler, SquareChevronRight } from 'lucide-vue-next'

export const navigation: NavMenu[] = [
  {
    label: '文库',
    href: '/',
  },
  {
    label: '专栏',
    href: '/',
    children: [
      {
        label: '效率工具',
        href: '/',
        icon: PencilRuler,
      },
      {
        label: '代码片段',
        href: '/',
        icon: SquareChevronRight,
      },
    ],
  },
  {
    label: '友链',
    href: '/',
  },
]
