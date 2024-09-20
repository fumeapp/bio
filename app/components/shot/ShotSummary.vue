<script setup lang="ts">
import type { Round } from '~/types/models'

const props = defineProps<{ round: Round }>()
const { unitsRemain } = useRound(props.round)
</script>

<template>
  <div>
    {{ unitsRemain() }} remaining units
  </div>
</template>
