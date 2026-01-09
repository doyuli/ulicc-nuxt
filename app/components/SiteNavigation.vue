<script setup lang="ts">
import type { Component } from 'vue'
import { navigationMenuTriggerStyle } from '~/components/ui/navigation-menu'
import { cn } from '~/lib/utils'

export interface NavMenu {
  label: string
  href?: string
  icon?: Component
  children?: NavItem[]
}

export interface NavItem {
  label: string
  href: string
  icon?: Component
  description?: string
}

defineProps<{
  menus: NavMenu[]
}>()
</script>

<template>
  <NavigationMenu :viewport="false">
    <NavigationMenuList>
      <template v-for="menu in menus" :key="menu.label">
        <NavigationMenuItem v-if="menu.children?.length">
          <NavigationMenuTrigger>
            {{ menu.label }}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-2">
              <li v-for="child in menu.children" :key="child.label">
                <NavigationMenuLink class="text-nowrap" as-child>
                  <NuxtLink :to="child.href">
                    <div class="flex items-center gap-2">
                      <component :is="child.icon" v-if="child.icon" class="size-4 shrink-0 opacity-70" />
                      <span>
                        {{ child.label }}
                      </span>
                    </div>
                    <div v-if="child.description" class="opacity-50">
                      {{ child.description }}
                    </div>
                  </NuxtLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem v-else>
          <NavigationMenuLink as-child :class="cn(navigationMenuTriggerStyle(), 'transition-none')">
            <NuxtLink :to="menu.href">
              {{ menu.label }}
            </NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </template>
    </NavigationMenuList>
  </NavigationMenu>
</template>
