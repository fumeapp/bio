<script setup lang="ts">
import type { Cartridge, Shot } from '~/types/models'

const props = defineProps<{ shots: Shot[], cartridge: Cartridge }>()

// takenUnits is a sum of all shot units
const takenUnits = computed(() => props.shots?.reduce((acc, curr) => acc + curr.units, 0))
const totalUnits = computed(() => props.cartridge.ml * 100)
const remainingUnits = computed(() => totalUnits.value - takenUnits.value)
</script>

<template>
  <div>
    {{ remainingUnits }} remaining units
  </div>
</template>
