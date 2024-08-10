<script setup lang="ts">
import type { Token } from '~/types/models'

defineProps<{ tokens: Token[] }>()
const emit = defineEmits(['reload'])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <token-card v-for="token in tokens" :key="token.id.toString()" :token="token" @reload="emit('reload')" />
  </div>
</template>

<style scoped></style>
