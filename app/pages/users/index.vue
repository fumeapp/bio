<script setup lang="ts">
import { formatDistance } from 'date-fns'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

const { set, fromLink } = useCrumb()

set(
  fromLink('Home'),
  {
    label: 'Users',
    icon: 'i-mdi-account-multiple',
    to: '/users',
  },
)

const columns = [
  { label: 'User', key: 'user' },
  { label: 'Created At', key: 'createdAt' },
  { label: 'Updated At', key: 'updatedAt' },
  { label: 'Rounds', key: 'rounds' },
  { label: 'Actions', key: 'actions' },
]

const { data: users } = await useFetch<MetapiResponse<User>>('/api/all/user')
</script>

<template>
  <div>
    <u-table :columns="columns" :rows="users?.data">
      <template #user-data="{ row }">
        <div class="flex items-center space-x-4">
          <u-avatar :src="row.avatar" />
          <div>
            <div> {{ row.name }}</div>
            <div> {{ row.email }}</div>
          </div>
        </div>
      </template>
      <template #createdAt-data="{ row }">
        {{ formatDistance(new Date(row.createdAt), new Date(), { addSuffix: true }) }}
      </template>
      <template #updatedAt-data="{ row }">
        {{ formatDistance(new Date(row.updatedAt), new Date(), { addSuffix: true }) }}
      </template>
      <template #rounds-data="{ row }">
        <div class="flex flex-col space-y-1">
          <round-summary v-for="round in row.rounds" :key="round.id" :round="round" />
        </div>
      </template>
      <template #actions-data="{ row }">
        <u-button icon="i-mdi-calendar" :to="`/users/${row.id}/rounds`" color="white" label="Rounds" />
      </template>
    </u-table>
  </div>
</template>

<style scoped></style>
