<script lang="ts" setup>
defineProps<{ large?: boolean }>()
</script>

<template>
  <div class="flex items-end">
    <div class="font-extrabold text-primary-900 dark:text-primary-200">fume</div>
    <u-icon v-if="large" name="i-mdi-circle" class="w-2 h-2 lg:w-12 lg:h-12 text-primary-900 dark:text-primary-100 mb-2" />
    <div v-else class="text-primary-900 dark:text-primary-100">.</div>
    <div class="font-extrabold text-primary-600 dark:text-primary-300">bio</div>
  </div>
</template>
