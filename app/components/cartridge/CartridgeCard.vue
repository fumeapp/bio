<script setup lang="ts">
import type { Cartridge } from '@prisma/client'

defineProps<{ cartridge: Cartridge }>()
</script>

<template>
  <div>
    <u-card>
      <div class="flex flex-col items-center justify-center space-y-8">
        <div class="flex flex-col items-center">
          <div class="w-5 h-2 bg-gray-500 rounded-sm" />
          <div class="w-3 h-2 bg-gray-300" />
          <div class="w-6 h-24 bg-gray-300 rounded-t-lg overflow-hidden">
            <div class="w-full h-1/2 bg-sky-500" />
            <div class="w-full h-4 bg-gray-900" />
            <div class="w-full h-1/2 bg-gray-800" />
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
