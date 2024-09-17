<script setup lang="ts">
import type { Round } from '~/types/models'

defineProps<{ round: Round }>()
</script>

<template>
  <div class="flex">
    <u-card class="w-full">
      <div class="flex flex-col items-center justify-center space-y-4">
        <pen-model :color="round.color">
          <transition name="fade">
            <cartridge-model :round="round" />
          </transition>
        </pen-model>
        <div>
          {{ round.content }} {{ round.ml }}ml {{ round.mg }}mg
        </div>
        <div>
          <shot-summary :round="round" />
        </div>
        <div>
          <shot-log :round="round" />
        </div>
      </div>
    </u-card>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
