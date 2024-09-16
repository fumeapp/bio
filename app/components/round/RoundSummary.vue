<script setup lang="ts">
import type { Round } from '@prisma/client'
import { format } from 'date-fns'

const props = defineProps<{ round: Round }>()
const { lastShotDay, nextRoundDay } = useRound(props.round)
</script>

<template>
  <div>
    <div> {{ round.content }} {{ round.mg }}mg</div>
    <div>
      Started {{ format(round.date, 'M/d/yy') }}
      Refill by {{ format(nextRoundDay(), 'M/d/yy') }}
    </div>
  </div>
</template>

<style scoped></style>
