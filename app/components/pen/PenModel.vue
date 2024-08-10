<script setup lang="ts">
import type { Pen } from '@prisma/client'

defineProps<{ pen: Pen }>()
</script>

<template>
  <div class="flex items-center relative">
    <div class="absolute left-6">
      <div class="opacity-75">
        <slot />
      </div>
    </div>
    <div class="w-2 h-7 rounded-l-sm" :class="`bg-${pen.color}-500`" />
    <div class="w-32 h-8 rounded-l-sm flex items-center justify-end border" :class="`border-${pen.color}-500 bg-${pen.color}-500/20`" />
    <div class="w-2 h-8 bg-gray-300" />
    <div class="w-20 h-8 border" :class="`border-${pen.color}-500 bg-${pen.color}-500/20`" />
    <div class="w-3 h-8 bg-gray-400" />
    <div class="w-1 h-8 bg-gray-500 rounded-r-sm" />
    <!--
    border-cyan-500
    border-sky-500
    border-teal-500
    border-blue-500
    border-pink-500
    border-gray-500
    -->
  </div>
</template>

<style scoped></style>
