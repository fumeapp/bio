<script lang="ts" setup>
import type { Round } from '~/types/models'

const props = defineProps<{ round: Round, label?: boolean }>()

const { unitsRemain } = useRound(props.round)
</script>

<template>
  <div class="flex items-center">
    <div class="w-3 h-8 bg-gray-500 rounded-sm" />
    <div class="w-2 h-5 bg-gray-300" />
    <div class="w-[310px] h-10 bg-gray-300 flex rounded-l overflow-hidden relative">
      <div class="absolute bg-white w-1 h-4 rounded-t bottom-0 left-[50px]" />
      <div class="absolute bg-white w-1 h-4 rounded-t bottom-0 left-[100px]" />
      <div class="absolute bg-white w-1 h-4 rounded-t bottom-0 left-[150px]" />
      <div class="absolute text-xs left-2 top-1 text-black">
        <span v-if="label" class="shadow">
          {{ round.content }} {{ round.mg }}mg
        </span>
      </div>

      <div :style="`width: ${unitsRemain()}px;`" class="h-full bg-gradient-to-b from-sky-600 to-sky-100 transition-all duration-1000" />

      <div class="h-full w-3 bg-black/80 flex-shrink-0 border-black border-l border-r" />
      <div class="h-full w-3 bg-black/80 flex-shrink-0 border-black border-r" />
      <div class="h-full flex-1 bg-sky-900" />
    </div>
  </div>
</template>

<style scoped>
.shadow {
  color: white;
  text-shadow:
   -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
     1px 1px 0 #000;
}
</style>
