<script setup lang="ts">
import { format } from 'date-fns'
import type { MetapiResponse } from '~/types/metapi'
import type { Shot } from '~/types/models'

useCrumb().add('Shots')

const route = useRoute()

const columns = [
  { label: 'Cartridge', key: 'cartridge' },
  { label: 'Units', key: 'units' },
  { label: 'Date', key: 'date' },
  { label: 'Actions', key: 'actions' },
]

const { data: shots, refresh } = useFetch<MetapiResponse<Shot[]>>('/api/shot')

const remove = async (id: number) =>
  await useApi().api(`/api/shot/${id}`, { method: 'DELETE' }).then(refresh)
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
