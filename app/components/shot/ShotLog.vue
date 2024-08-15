<script lang="ts" setup>
import type { Shot } from '@prisma/client'
import { format } from 'date-fns'

defineProps<{ shots?: Shot[] }>()
const emit = defineEmits(['reload'])
const route = useRoute()
const remove = async (id: bigint) =>
  await useApi().api(route.params.user
    ? `/api/user/${route.params.user}/shot/${id.toString()}`
    : `/api/shot/${id.toString()}`, { method: 'DELETE' }).then(() => emit('reload'))
</script>

<template>
  <div v-if="shots" class="border border-gray-300 dark:border-gray-800 rounded-lg flex flex-col divide-y divide-gray-300 dark:divide-gray-800">
    <div v-for="shot in shots" :key="shot.id.toString()" class="py-1 px-4 flex items-center justify-between space-x-4 text-sm">
      <span> {{ shot.units }} units {{ format(shot.date, 'eeee M/d/yy') }} </span>
      <u-button icon="i-mdi-trash-can" size="2xs" color="red" variant="link" @click="remove(shot.id)" />
    </div>
  </div>
  <div v-else>
    Cartridge is full
  </div>
</template>

<style scoped></style>
