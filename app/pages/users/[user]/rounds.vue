<script setup lang="ts">
import type { Round } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

const roundModal = ref(false)
const roundUpdate = ref<Round>()
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

const complete = () => {
  roundModal.value = false
  roundUpdate.value = undefined
  refresh()
}

const update = (round: Round) => {
  roundUpdate.value = round
  roundModal.value = true
}

const remove = async (round: Round) =>
  await useApi()
    .api<MetapiResponse<Round>>(`/api/user/${route.params.user}/round/${round.id}`, { method: 'DELETE' })
    .then(() => refresh())

const confirm = (round: Round) =>
  useConfirm().confirm(
    'Delete round',
    `Are you sure you want to delete the round ${round.content}?`,
    'Delete',
    () => remove(round),
  )

const columns = [
  { label: 'Content', key: 'content' },
  { label: 'Mg', key: 'mg' },
  { label: 'Ml', key: 'ml' },
  { label: 'Timeline', key: 'date' },
  { label: 'Actions', key: 'actions' },
]
</script>

<template>
  <div>
    <u-dashboard-modal
      v-model="roundModal"
      title="Add/Update round"
      description="Add/Update a user round"
      icon="i-mdi-calendar"
      @close="roundModal = false"
    >
      <round-form :round="roundUpdate" @complete="complete" />
    </u-dashboard-modal>
    <div>
      <u-table :columns="columns" :rows="rounds?.data">
        <template #date-data="{ row }">
          <round-summary :round="row" />
        </template>
        <template #actions-data="{ row }">
          <u-button-group>
            <u-button icon="i-mdi-pencil" color="white" @click="update(row)" />
            <u-button icon="i-mdi-trash" color="white" @click="confirm(row)" />
          </u-button-group>
        </template>
      </u-table>
    </div>
  </div>
</template>
