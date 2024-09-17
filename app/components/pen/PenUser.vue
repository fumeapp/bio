<script setup lang="ts">
import type { MetapiResponse } from '~/types/metapi'
import type { Round } from '~/types/models'

const { user } = useUserSession()
const { data: rounds, refresh } = await useFetch<MetapiResponse<Round[]>>(`/api/user/${user.value.id}/round`)
</script>

<template>
  <div v-if="rounds?.data.length === 0" class="w-full max-w-md">
    <u-alert
      icon="i-mdi-clock"
      title="Awaiting Assignment"
      description="We are still setting up your account, check back soon!"
      :actions="[{ label: 'Refresh', icon: 'i-mdi-refresh', click: refresh, variant: 'solid' }]"
    />
  </div>
  <pen-list
    v-else-if="rounds"
    :rounds="rounds?.data"
  />
</template>

<style scoped></style>
