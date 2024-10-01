<script setup lang="ts">
import type { Round } from '~/types/models'

const props = defineProps<{ round: Round }>()
const { unitsRemain, mgPerUnits } = useRound(props.round)
</script>

<template>
  <div>
    <div> {{ unitsRemain() }} remaining units </div>
    <div> {{ round.units }} units = {{ mgPerUnits() }}mg </div>
  </div>
</template>
