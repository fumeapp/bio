<script setup lang="ts">
import type { Cartridge } from '@prisma/client'

defineProps<{ cartridges: Cartridge[] }>()
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <cartridge-card v-for="cartridge in cartridges" :key="cartridge.id.toString()" :cartridge="cartridge" />
    </div>
  </div>
</template>

<style scoped></style>
