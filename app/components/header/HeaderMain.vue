<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const { crumbs, actions } = useCrumb()
const { loggedIn } = useUserSession()

const { toggleContentSearch } = useUIState()

const navigation = inject<NavItem[]>('navigation', [])

const links = [
  {
    label: 'Home',
    ico: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Research',
    ico: 'i-heroicons-academic-cap',
    to: '/research',
  },
]
</script>

<template>
  <u-header :links="links">
    <template #logo>
      <div class="flex items-center space-x-2">
        <logo-bio class="w-10 h-10" />
        <logo-text class="text-3xl" />
      </div>
    </template>
    <template #right>
      <!--
      <UContentSearchButton class="hidden lg:flex w-12 bg-red-500" />
      -->
      <u-button icon="i-mdi-magnify" variant="ghost" @click="toggleContentSearch" />
      <div class="flex items-center space-x-2">
        <u-color-mode-button color="primary" />
        <header-profile v-if="loggedIn" />
        <header-sign-in v-else />
      </div>
    </template>
    <template #panel>
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </u-header>
  <div>
    <div class="py-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <client-only>
        <div v-if="crumbs.length" class="flex items-center justify-between space-x-2 py-2">
          <u-breadcrumb :links="crumbs" />
          <u-button-group v-if="actions && actions[0]" :size="actions[0].size">
            <u-button v-for="action in actions" :key="action.label" v-bind="action" @click="action.click" />
          </u-button-group>
        </div>
        <div v-else class="h-10" />
        <template #fallback>
          <div class="h-10">&nbsp;</div>
        </template>
      </client-only>
    </div>
  </div>
</template>

<style>
.logopath-1 {
  fill: var(--color-primary-500);
}

.logopath-2 {
  fill: var(--color-primary-300);
}
</style>
