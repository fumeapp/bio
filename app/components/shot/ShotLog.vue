<script lang="ts" setup>
import type { Shot } from '@prisma/client'
import { format } from 'date-fns'

defineProps<{ shots?: Shot[] }>()
</script>

<template>
  <div v-if="shots" class="border border-gray-300 dark:border-gray-800 rounded-lg flex flex-col divide-y divide-gray-300 dark:divide-gray-800">
    <div v-for="shot in shots" :key="shot.id.toString()" class="py-1 px-4">
      {{ shot.units }} units taken on {{ format(shot.date, 'eeee M/d/yy') }}
    </div>
  </div>
  <div v-else>
    Cartridge is full
  </div>
</template>

<style scoped></style>
