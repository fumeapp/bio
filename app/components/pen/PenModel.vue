<script setup lang="ts">
import type { Pen } from '@prisma/client'

defineProps<{ pen: Pen }>()
</script>

<template>
  <div class="flex items-center">
    <div class="w-2 h-5 rounded-l-sm border-r border-r-gray-900" :class="`bg-${pen.color}-500`" />
    <div class="w-20 h-6 rounded-l-sm" :class="`bg-${pen.color}-500`">
      <slot />
    </div>
    <div class="w-2 h-6 bg-gray-300" />
    <div class="w-20 h-6 rounded-l-sm" :class="`bg-${pen.color}-500`" />
    <div class="w-3 h-6 bg-gray-400" />
    <div class="w-1 h-6 bg-gray-500 rounded-r-sm" />
  </div>
</template>

<style scoped></style>
