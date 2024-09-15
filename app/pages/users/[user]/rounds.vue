<script setup lang="ts">
import type { Round } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

const roundModal = ref(false)

const route = useRoute()
const { data: user } = await useFetch<MetapiResponse<User>>(`/api/all/user/${route.params.user}`)

const { set, fromLink, action } = useCrumb()

set(
  fromLink('Home'),
  fromLink('Users'),
  { label: user.value?.data.name as string, icon: 'i-mdi-account' },
  { label: 'Rounds', icon: 'i-mdi-calendar' },
)
action(
  { label: 'Add a Round', click: () => roundModal.value = true },
)

const { data: rounds, refresh } = await useFetch<MetapiResponse<Round[]>>(`/api/user/${route.params.user}/round`)
</script>

<template>
  <div>
    <u-dashboard-modal
      v-model="roundModal"
      title="Add a round"
      description="Give this user a new round"
      icon="i-mdi-calendar"
      @close="roundModal = false"
    >
      <round-form @creaed="refresh" @close="roundModal = false" />
    </u-dashboard-modal>
    <div>
      {{ rounds }}
    </div>
  </div>
</template>

<style scoped></style>
