<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

const route = useRoute()
const penModal = ref(false)
const cartridgeModal = ref(false)
const { data: user } = await useFetch<MetapiResponse<User>>(`/api/all/user/${route.params.user}`)

const { set, fromLink, action } = useCrumb()

set(
  fromLink('Home'),
  fromLink('Users'),
  { label: user.value?.data.name as string, icon: 'i-mdi-account' },
  { label: 'Equipment', icon: 'i-mdi-medical-bag' },
)
action(
  { label: 'Add a Pen', click: () => penModal.value = true },
  { label: 'Add a Cartridge', click: () => cartridgeModal.value = true },
)

const { data: pens, refresh: penRefresh } = await useFetch<MetapiResponse<Pen[]>>(`/api/user/${route.params.user}/pen`)
const { data: cartridges, refresh: cartRefresh } = await useFetch<MetapiResponse<Cartridge[]>>(`/api/user/${route.params.user}/cartridge`)

const refresh = () => {
  penRefresh()
  cartRefresh()
}

const reload = () => {
  refresh()
  penModal.value = false
  cartridgeModal.value = false
}
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="text-lg font-semibold">Pens </div>
    <pen-list :pens="pens?.data" :cartridges="cartridges?.data" @reload="reload" />
    <div class="text-lg font-semibold">Cartridges </div>
    <cartridge-list :cartridges="cartridges?.data" @reload="reload" />
    <u-dashboard-modal
      v-model="penModal"
      title="Add a pen"
      description="Choose the color of your pen"
      icon="i-mdi-pen"
      @close="penModal = false"
    >
      <pen-form @created="reload" @close="penModal = false" />
    </u-dashboard-modal>
    <u-dashboard-modal
      v-model="cartridgeModal"
      title="Add a cartridge"
      description="Choose the color of your cartridge"
      icon="i-mdi-cartridge"
      @close="cartridgeModal = false"
    >
      <cartridge-form @created="reload" @close="cartridgeModal = false" />
    </u-dashboard-modal>
  </div>
</template>
