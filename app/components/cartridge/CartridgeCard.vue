<script setup lang="ts">
import type { Round } from '~/types/models'

defineProps<{ round: Round }>()
</script>

<template>
  <div class="flex">
    <u-card>
      <div class="flex flex-col items-center justify-center space-y-8">
        <cartridge-model :round="round" />
        <div>
          {{ round.content }}
          {{ round.ml }}ml
          {{ round.mg }}mg
        </div>
        <shot-log :round="round" />
      </div>
    </u-card>
  </div>
</template>

<style scoped></style>
