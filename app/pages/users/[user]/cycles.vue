<script setup lang="ts">
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

const cycleModal = ref(false)

const route = useRoute()
const { data: user, refresh } = await useFetch<MetapiResponse<User>>(`/api/all/user/${route.params.user}`)

const { set, fromLink, action } = useCrumb()

set(
  fromLink('Home'),
  fromLink('Users'),
  { label: user.value?.data.name as string, icon: 'i-mdi-account' },
  { label: 'Cycles', icon: 'i-mdi-calendar' },
)
action(
  { label: 'Add a Cycle', click: () => cycleModal.value = true },
)
</script>

<template>
  <div>
    <u-dashboard-modal
      v-model="cycleModal"
      title="Add a Cycle"
      description="Give this user a new cycle"
      icon="i-mdi-calendar"
      @close="cycleModal = false"
    >
      <cycle-form @creaed="refresh" @close="cycleModal = false" />
    </u-dashboard-modal>
  </div>
</template>

<style scoped></style>
