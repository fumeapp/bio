<script setup lang="ts">
const { crumbs, actions } = useCrumb()
</script>

<template>
  <u-header>
    <template #logo>
      <div class="flex items-center">
        <logo-bio class="w-12 h-12" />
        <logo-text class="text-3xl" />
      </div>
    </template>
    <template #right>
      <div class="flex items-center space-x-2">
        <header-profile />
        <u-color-mode-button />
      </div>
    </template>
  </u-header>
  <div class="bg-gray-100 dark:bg-gray-950">
    <div class="py-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div v-if="crumbs.length" class="flex items-center justify-between space-x-2 py-2">
        <u-breadcrumb :links="crumbs" />
        <u-button-group v-if="actions && actions[0]" :size="actions[0].size">
          <u-button v-for="action in actions" :key="action.label" v-bind="action" @click="action.click" />
        </u-button-group>
      </div>
      <div v-else class="h-10" />
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
