<script lang="ts" setup>
import type { Cartridge } from '~/types/models'

const props = defineProps<{ cartridge?: Cartridge, label?: boolean }>()

const { remainingUnits } = useShot()
const units = computed(() => props.cartridge ? remainingUnits(props.cartridge?.shots || [], props.cartridge) : 200)
</script>

<template>
  <div class="flex items-center">
    <div class="w-2 h-5 bg-gray-500 rounded-sm" />
    <div class="w-1 h-3 bg-gray-300" />
    <div class="w-48 h-6 bg-gray-300 flex rounded-l overflow-hidden relative">
      <div class="absolute text-xs left-2 top-1 text-black">
        <span v-if="cartridge && label" class="shadow">
          {{ cartridge.content }} {{ cartridge.mg }}mg
        </span>
      </div>

      <div :style="`width: ${units * 2}px;`" class="h-full bg-gradient-to-b from-sky-600 to-sky-100 transition-all duration-1000" />

      <div class="h-full w-2 bg-black/80 flex-shrink-0 border-black border-l border-r" />
      <div class="h-full w-2 bg-black/80 flex-shrink-0 border-black border-r" />
      <div class="h-full w-full bg-sky-900" />
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
