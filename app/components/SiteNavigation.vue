<script lang="ts">
import type { Component } from 'vue'
import { navigationMenuTriggerStyle } from '~/components/ui/navigation-menu'
import { cn } from '~/lib/utils'

interface BaseItem {
  label: string
  icon?: Component
}

export interface NavLink extends BaseItem {
  href: string
  description?: string
}

export interface NavGroup extends BaseItem {
  children: NavLink[]
}

export type NavItem = NavLink | NavGroup

export const isNavGroup = (item: NavItem): item is NavGroup => 'children' in item
</script>

<script setup lang="ts">
defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <NavigationMenu :viewport="false">
    <NavigationMenuList>
      <template v-for="item in items" :key="item.label">
        <NavigationMenuItem v-if="isNavGroup(item)">
          <NavigationMenuTrigger>
            {{ item.label }}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-2">
              <li v-for="child in item.children" :key="child.label">
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
            <NuxtLink :to="item.href">
              {{ item.label }}
            </NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </template>
    </NavigationMenuList>
  </NavigationMenu>
</template>
