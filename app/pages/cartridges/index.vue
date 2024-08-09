<script setup lang="ts">
import type { Cartridge } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const cartridgeModal = ref(false)
useCrumb().add('Cartridges').action({ label: 'Add a Cartridge', click: () => cartridgeModal.value = true })

const { data: cartridges, refresh } = await useApi().api<MetapiResponse<Cartridge[]>>('/api/cartridge')

const created = () => {
  refresh()
  cartridgeModal.value = false
}
</script>

<template>
  <div>
    <cartridge-list :cartridges="cartridges.data" class="my-12" />
    <u-dashboard-modal
      v-model="cartridgeModal"
      title="Add a cartridge"
      description="Choose the color of your cartridge"
      icon="i-mdi-cartridge"
      @close="cartridgeModal = false"
    >
      <cartridge-form @created="created" @close="cartridgeModal = false" />
    </u-dashboard-modal>
  </div>
</template>
