<script setup lang="ts">
import type { Pen } from '@prisma/client'
import { formatDistance } from 'date-fns'
import type { MetapiResponse } from '~/types/metapi'
import type { Cartridge, User } from '~/types/models'

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

const { data: users, refresh } = await useApi().api<MetapiResponse<User>>('/api/user')
const cartPen = (pen: Pen, cartridges: Cartridge[]) => {
  return cartridges.find(cartridge => cartridge.id === pen.cartridgeId)
}
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
        <pen-model v-for="pen in row.pens" :key="pen.id" :pen="pen">
          <cartridge-model v-if="cartPen(pen, row.cartridges)" :cartridge="cartPen(pen, row.cartridges)" />
          <div v-else>
            No Cartridge
          </div>
        </pen-model>
      </template>
      <template #actions-data="{ row }">
        <u-button-group size="sm" variant="soft">
          <u-button icon="i-mdi-pen" :to="`/users/${row.id}/pens`" color="white" label="Pens" />
          <u-button icon="i-mdi-bottle-soda" :to="`/users/${row.id}/cartridges`" color="white" label="Cartridges" />
        </u-button-group>
      </template>
    </u-table>
  </div>
</template>

<style scoped></style>
