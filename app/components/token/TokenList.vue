<script setup lang="ts">
import type { TokenWithClient } from '~/types/models'

defineProps<{ tokens: TokenWithClient[] }>()
const emit = defineEmits(['reload'])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <token-card v-for="token in tokens" :key="token.id" :token="token" @reload="emit('reload')" />
  </div>
</template>

<style scoped></style>
