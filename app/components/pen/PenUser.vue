<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const { user } = useUserSession()
const { data: pens, refresh: pensRefresh } = await useFetch<MetapiResponse<Pen[]>>(`/api/user/${user.value.id}/pen`)
const { data: cartridges, refresh: cartridgesRefresh } = await useFetch<MetapiResponse<Cartridge[]>>(`/api/user/${user.value.id}/cartridge`)
const reload = async () => {
  await pensRefresh()
  await cartridgesRefresh()
}
</script>

<template>
  <div v-if="pens?.data.length === 0" class="w-full max-w-md">
    <u-alert
      icon="i-mdi-clock"
      title="Awaiting Pen Assignment"
      description="We are still setting up your injection pen, check back soon!"
      :actions="[{ label: 'Refresh', icon: 'i-mdi-refresh', click: reload, variant: 'solid' }]"
    />
  </div>
  <pen-list
    v-else-if="pens && cartridges"
    :pens="pens?.data"
    :cartridges="cartridges?.data"
    readonly
    @reload="reload"
  />
</template>

<style scoped></style>
