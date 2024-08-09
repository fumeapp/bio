<script setup lang="ts">
import type { Cartridge } from '@prisma/client'

defineProps<{ cartridge: Cartridge }>()
</script>

<template>
  <div>
    <u-card>
      <div class="flex flex-col items-center justify-center space-y-8">
        <div class="flex items-center">
          <div class="w-2 h-5 bg-gray-500 rounded-sm" />
          <div class="w-2 h-3 bg-gray-300" />
          <div class="w-24 h-6 bg-gray-300 flex rounded-l-lg overflow-hidden">
            <div class="h-full w-1/2 bg-sky-500" />
            <div class="h-full w-4 bg-sky-900" />
            <div class="h-full w-1/2 bg-sky-800" />
          </div>
        </div>
        <div>
          {{ cartridge.content }}
          {{ cartridge.ml }}ml
        </div>
      </div>
    </u-card>
  </div>
</template>

<style scoped></style>
