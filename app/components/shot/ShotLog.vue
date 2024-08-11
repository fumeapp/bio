<script lang="ts" setup>
import type { Shot } from '@prisma/client'
import { format } from 'date-fns'

defineProps<{ shots: Shot[] }>()
</script>

<template>
  <div>
    <div v-for="shot in shots" :key="shot.id.toString()">
      {{ shot.units }} units taken at {{ format(shot.date, 'M/d/yy') }}
    </div>
  </div>
</template>

<style scoped></style>
