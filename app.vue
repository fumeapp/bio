<script lang="ts" setup>
import type { User } from '@prisma/client'
const users = ref<{ data: User[] }>()
const get = async () => 
  users.value = await $fetch<{data: User[]}>('/api/user')
onMounted(get)
</script>

<template>
  <UContainer>
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          {{ users?.data }}
        </div>
      </template>
    </UCard>
  </UContainer>
</template>
