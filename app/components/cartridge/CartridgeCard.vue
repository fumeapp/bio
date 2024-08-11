<script setup lang="ts">
import type { Cartridge } from '~/types/models'

defineProps<{ cartridge: Cartridge }>()
</script>

<template>
  <div>
    <u-card>
      <div class="flex flex-col items-center justify-center space-y-8">
        <cartridge-model :cartridge="cartridge" />
        <div>
          {{ cartridge.content }}
          {{ cartridge.ml }}ml
          {{ cartridge.mg }}mg
        </div>
        <shot-log :shots="cartridge?.shots" />
      </div>
    </u-card>
  </div>
</template>

<style scoped></style>
