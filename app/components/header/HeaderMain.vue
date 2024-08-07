<script setup lang="ts">
const crumbs = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/',
}, {
  label: 'Pens',
  icon: 'i-mdi-pen',
}]

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Pens',
    icon: 'i-mdi-pen',
    to: '/pens',
  },
  {
    label: 'Cartridges',
    to: '/cartridges',
    icon: 'i-mdi-bottle-soda-outline',
  },
]
</script>

<template>
  <u-header :links="links">
    <template #logo>
      <div class="flex items-center">
        <div class="relative w-12 h-12">
          <header-logo />
          <u-icon name="i-mdi-test-tube" class="w-6 h-6 text-primary-100 absolute bottom-1.5 right-0.5" />
        </div>
        <div class="font-extrabold text-3xl pr-1 text-primary-900 dark:text-primary-100">fume</div>
        <div class="font-extrabold text-3xl pr-1 text-primary-600 dark:text-primary-300 -ml-1">bio</div>
      </div>
    </template>
    <template #right>
      <div class="flex items-center space-x-2">
        <header-auth />
        <client-only>
          <u-color-mode-button />
          <template #fallback>
            <u-skeleton class="w-8 h-8 rounded-full" />
          </template>
        </client-only>
      </div>
    </template>
    <!--
    <template #bottom>
      <div class="py-2 px-4">
        <u-breadcrumb :links="crumbs" />
      </div>
    </template>
    -->
  </u-header>
  <div class="bg-gray-100 dark:bg-gray-950">
    <div class="py-2 px-10 max-w-7xl mx-auto">
      <u-breadcrumb :links="crumbs" />
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
