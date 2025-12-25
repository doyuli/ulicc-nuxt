import type { NavMenu } from '~/components/SiteNavigation.vue'
import { FileTextIcon, HashIcon, PencilRuler, SquareChevronRight } from 'lucide-vue-next'

export const navigation: NavMenu[] = [
  {
    label: '文库',
    children: [
      {
        label: '文章归档',
        href: '/archive',
        icon: FileTextIcon,
      },
      {
        label: '全部标签',
        href: '/tags',
        icon: HashIcon,
      },
    ],
  },
  {
    label: '专栏',
    children: [
      {
        label: '效率工具',
        href: '/tools',
        icon: PencilRuler,
      },
      {
        label: '代码片段',
        href: '/snippets',
        icon: SquareChevronRight,
      },
    ],
  },
  {
    label: '关于',
    href: '/about',
  },
]
