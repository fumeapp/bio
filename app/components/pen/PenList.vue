<script setup lang="ts">
import type { Round } from '~/types/models'

defineProps<{ rounds: Round[] }>()
const emit = defineEmits(['reload'])
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <pen-card
        v-for="round in rounds" :key="round.id"
        :round="round"
        @reload="emit('reload')"
      />
    </div>
  </div>
</template>

<style scoped></style>
