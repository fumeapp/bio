<script setup lang="ts">
import type { Cartridge, Shot } from '~/types/models'

defineProps<{ shots: Shot[], cartridge: Cartridge }>()
const { remainingUnits } = useShot()
</script>

<template>
  <div>
    {{ remainingUnits(shots, cartridge) }} remaining units
  </div>
</template>
