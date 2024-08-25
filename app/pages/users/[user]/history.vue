<script setup lang="ts">
import { format } from 'date-fns'
import type { Shot, User } from '~/types/models'
import type { MetapiResponse } from '~/types/metapi'

const route = useRoute()
const { data: user } = await useFetch<MetapiResponse<User>>(`/api/all/user/${route.params.user}`)

const { set, fromLink } = useCrumb()

set(
  fromLink('Home'),
  fromLink('Users'),
  { label: user.value?.data.name as string, icon: 'i-mdi-account' },
  fromLink('Shots'),
)

const columns = [
  { label: 'Cartridge', key: 'cartridge' },
  { label: 'Units', key: 'units' },
  { label: 'Date', key: 'date' },
  { label: 'Actions', key: 'actions' },
]

const { data: shots, refresh } = await useFetch<MetapiResponse<Shot[]>>(`/api/user/${route.params.user}/shot`)

const remove = async (id: number) =>
  await useApi().api(`/api/user/${route.params.user}/shot/${id}`, { method: 'DELETE' }).then(() => refresh())
</script>

<template>
  <div>
    <u-table :columns="columns" :rows="shots?.data">
      <template #cartridge-data="{ row }">
        {{ row.cartridge.content }} {{ row.cartridge.mg }}mg {{ row.cartridge.ml }}ml
      </template>
      <template #date-data="{ row }">
        {{ format(row.date, 'eeee - M/d/yy') }}
      </template>
      <template #actions-data="{ row }">
        <u-button icon="i-mdi-trash" color="red" variant="soft" @click="remove(row.id)" />
      </template>
    </u-table>
  </div>
</template>

<style scoped></style>
