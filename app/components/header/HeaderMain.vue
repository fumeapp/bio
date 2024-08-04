<script setup lang="ts">
const links = [
  {
    label: 'Pens',
    to: '/pens',
  },
  {
    label: 'Cartridges',
    to: '/cartridges',
  },
]
</script>

<template>
  <u-header :links="links">
    <template #logo>
      <div class="flex items-center">
        <div class="relative">
          <header-logo />
          <u-icon name="i-mdi-test-tube" class="w-6 h-6 text-primary-100 absolute bottom-1 right-0.5" />
        </div>
        <div class="font-extrabold text-3xl pr-1 text-primary-900 dark:text-primary-100">fume</div>
        <div class="font-extrabold text-3xl pr-1 text-primary-600 dark:text-primary-300 -ml-1">bio</div>
      </div>
    </template>
    <template #right>
      <div class="flex items-center space-x-2">
        <header-auth />
        <client-only>
          <u-color-mode-toggle />
          <template #fallback>
            <u-skeleton class="w-10 h-6 rounded-full" />
          </template>
        </client-only>
      </div>
    </template>
  </u-header>
</template>

<style>
.logopath-1 {
  fill: var(--color-primary-500);
}

.logopath-2 {
  fill: var(--color-primary-300);
}
</style>
