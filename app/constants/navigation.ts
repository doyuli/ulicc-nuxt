import type { NavItem } from '~/components/SiteNavigation.vue'
import {
  FileTextIcon,
  HashIcon,
  PencilRuler,
  Projector,
  SmilePlus,
  SquareChevronRight,
  StoreIcon,
} from 'lucide-vue-next'

export const NAV_CONFIG: NavItem[] = [
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
    icon: StoreIcon,
    children: [
      {
        label: '关于博主',
        href: '/about',
        icon: SmilePlus,
      },
      {
        label: '我的项目',
        href: '/projects',
        icon: Projector,
      },
    ],
  },

]
