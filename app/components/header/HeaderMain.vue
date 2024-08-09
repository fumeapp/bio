<script setup lang="ts">
const { crumbs, links, actions } = useCrumb()
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
  </u-header>
  <div class="bg-gray-100 dark:bg-gray-950">
    <div class="py-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <client-only>
        <div class="flex items-center justify-between space-x-2">
          <u-breadcrumb :links="crumbs" />
          <u-button v-for="action in actions" :key="action.label" v-bind="action" @click="action.click" />
        </div>
        <template #fallback>
          <div class="flex items-center space-x-2">
            <u-skeleton class="w-6 h-6" />
            <u-skeleton class="w-14 h-6" />
          </div>
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
