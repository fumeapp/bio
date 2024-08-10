<script setup lang="ts">
import type { Pen } from '@prisma/client'

defineProps<{ pen: Pen }>()
</script>

<template>
  <div class="flex items-center">
    <div class="w-2 h-7 rounded-l-sm border-r border-r-gray-900" :class="`bg-${pen.color}-500`" />
    <div class="w-32 h-8 rounded-l-sm flex items-center justify-end" :class="`bg-${pen.color}-500`">
      <div class="mr-1">
        <slot />
      </div>
    </div>
    <div class="w-2 h-8 bg-gray-300" />
    <div class="w-20 h-8 rounded-l-sm" :class="`bg-${pen.color}-500`" />
    <div class="w-3 h-8 bg-gray-400" />
    <div class="w-1 h-8 bg-gray-500 rounded-r-sm" />
  </div>
</template>

<style scoped></style>
