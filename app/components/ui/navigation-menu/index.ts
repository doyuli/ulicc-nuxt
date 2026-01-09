import { cva } from 'class-variance-authority'

export { default as NavigationMenu } from './NavigationMenu.vue'
export { default as NavigationMenuContent } from './NavigationMenuContent.vue'
export { default as NavigationMenuIndicator } from './NavigationMenuIndicator.vue'
export { default as NavigationMenuItem } from './NavigationMenuItem.vue'
export { default as NavigationMenuLink } from './NavigationMenuLink.vue'
export { default as NavigationMenuList } from './NavigationMenuList.vue'
export { default as NavigationMenuTrigger } from './NavigationMenuTrigger.vue'
export { default as NavigationMenuViewport } from './NavigationMenuViewport.vue'

export const navigationMenuTriggerStyle = cva(
  [
    'group relative inline-flex h-8 w-max items-center justify-center text-base text-nowrap rounded-md px-4 py-1 font-medium outline-none transition-[color,box-shadow]',
    'hover:bg-transparent hover:text-primary data-[state=open]:hover:bg-transparent data-[state=open]:text-primary data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent',
    'focus:bg-transparent focus:text-primary focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1',
    'disabled:pointer-events-none disabled:opacity-50',
    // overlay navigation-menu-link style
    'data-active:focus:bg-transparent data-active:hover:bg-transparent data-active:bg-transparent data-active:text-primary',
  ],
)
