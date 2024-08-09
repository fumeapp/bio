<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const penModal = ref(false)

useCrumb().add('Pens').action({ label: 'Add a Pen', click: () => penModal.value = true })

const { data: pens, refresh: penRefresh } = await useApi().api<MetapiResponse<Pen[]>>('/api/pen')
const { data: cartridges, refresh: cartRefresh } = await useApi().api<MetapiResponse<Cartridge[]>>('/api/cartridge')

const refresh = () => {
  penRefresh()
  cartRefresh()
}

const created = () => {
  refresh()
  penModal.value = false
}
</script>

<template>
  <div>
    <div class="flex justify-end -mt-[90px]">
      <u-button :ui="{ rounded: 'rounded-full' }" icon="i-mdi-plus" size="xs" @click="penModal = true" />
    </div>
    <pen-list :pens="pens.data" :cartridges="cartridges.data" class="my-12" @reload="created" />
    <u-dashboard-modal
      v-model="penModal"
      title="Add a pen"
      description="Choose the color of your pen"
      icon="i-mdi-pen"
      @close="penModal = false"
    >
      <pen-form @created="created" />
    </u-dashboard-modal>
  </div>
</template>

<style scoped></style>
