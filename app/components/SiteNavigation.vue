<script setup lang="ts">
import type { Component } from 'vue'
import { navigationMenuTriggerStyle } from '~/components/ui/navigation-menu'

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
                <NavigationMenuLink as-child>
                  <NuxtLink class="text-nowrap" :to="child.href">
                    <div class="flex items-center gap-2">
                      <component :is="child.icon" v-if="child.icon" class="size-4 shrink-0 text-muted-foreground" />
                      <span>
                        {{ child.label }}
                      </span>
                    </div>
                    <div v-if="child.description" class="text-muted-foreground">
                      {{ child.description }}
                    </div>
                  </NuxtLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem v-else>
          <NavigationMenuLink as-child :class="navigationMenuTriggerStyle()">
            <NuxtLink class="text-nowrap" :to="menu.href">
              {{ menu.label }}
            </NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </template>
    </NavigationMenuList>
  </NavigationMenu>
</template>
