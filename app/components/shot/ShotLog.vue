<script lang="ts" setup>
import { format } from 'date-fns'
import type { Round } from '~/types/models'

const props = defineProps<{ round: Round }>()
const { shotDays } = useRound(props.round)
</script>

<template>
  <div class="border border-gray-300 dark:border-gray-800 rounded-lg flex flex-col divide-y divide-gray-300 dark:divide-gray-800">
    <div v-for="shot in shotDays()" :key="shot.date.toString()" class="py-1 px-4 flex items-center justify-between space-x-4 text-sm">
      <u-icon v-if="shot.taken" name="i-mdi-check-bold" class="text-emerald-400" />
      <u-icon v-else name="i-mdi-clock" class="text-sky-400" />
      <span> {{ format(shot.date, 'eeee M/d/yy') }} </span>
    </div>
  </div>
</template>

<style scoped></style>
