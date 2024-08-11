<script lang="ts" setup>
import type { Cartridge } from '~/types/models'

defineProps<{ cartridge?: Cartridge }>()
</script>

<template>
  <div class="flex items-center">
    <div class="w-2 h-5 bg-gray-500 rounded-sm" />
    <div class="w-1 h-3 bg-gray-300" />
    <div class="w-48 h-6 bg-gray-300 flex rounded-l overflow-hidden relative">
      <div class="absolute text-xs left-2 top-1 text-black">
        <span v-if="cartridge" class="shadow">
          {{ cartridge.content }} {{ cartridge.mg }}mg
        </span>
      </div>
      <div class="h-full w-3/4 bg-sky-500 bg-gradient-to-t from-sky-600 to-sky-300" />
      <div class="h-full w-4 bg-black/80" />
      <div class="h-full w-1/4 bg-sky-800" />
    </div>
  </div>
</template>

<style scoped>
.shadow {
  color: white;
  text-shadow:
   -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
     1px 1px 0 #000;
}
</style>
