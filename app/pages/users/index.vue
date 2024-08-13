<script setup lang="ts">
import type { Pen } from '@prisma/client'
import { formatDistance } from 'date-fns'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

useCrumb().add('Users')

const columns = [
  {
    label: 'User',
    key: 'user',
  },
  {
    label: 'Created At',
    key: 'createdAt',
  },
  {
    label: 'Updated At',
    key: 'updatedAt',
  },
  {
    label: 'Pens',
    key: 'pens',
  },
  {
    label: 'Actions',
    key: 'actions',
  },
]

const { data: users } = await useApi().fetch<MetapiResponse<User>>('/api/user')
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
      <template #pens-data="{ row }">
        <pen-model v-for="pen in row.pens" :key="pen.id" :color="pen.color">
          <cartridge-model v-if="pen.cartridge" :cartridge="pen.cartridge" />
          <div v-else>
            No Cartridge
          </div>
        </pen-model>
      </template>
      <template #actions-data="{ row }">
        <u-button icon="i-mdi-medical-bag" :to="`/users/${row.id}/equipment`" color="white" label="Equipment" />
      </template>
    </u-table>
  </div>
</template>

<style scoped></style>
