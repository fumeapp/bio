<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'

defineProps<{ pens: Pen[], cartridges: Cartridge[] }>()
const emit = defineEmits(['reload'])
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <pen-card v-for="pen in pens" :key="pen.id.toString()" :pen="pen" :cartridges="cartridges" @reload="emit('reload')" />
    </div>
  </div>
</template>

<style scoped></style>
