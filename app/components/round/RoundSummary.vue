<script setup lang="ts">
import type { Round } from '@prisma/client'
import { format } from 'date-fns'

const props = defineProps<{ round: Round }>()
const { nextRoundDate } = useRound(props.round)
</script>

<template>
  <div>
    <div> {{ round.content }} {{ round.mg }}mg</div>
    <div>
      Started {{ format(round.date, 'M/d/yy') }}
      Refill by {{ format(nextRoundDate(), 'M/d/yy') }}
    </div>
  </div>
</template>

<style scoped></style>
