<script setup lang="ts">
import type { Cartridge } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const cartridgeModal = ref(false)
useCrumb().add('Cartridges').action({ label: 'Add a Cartridge', click: () => cartridgeModal.value = true })

const cartridges = ref<Cartridge[]>([])

const get = async () => {
  const { data } = await useApi().fetch<MetapiResponse<Cartridge[]>>('/api/cartridge')
  cartridges.value = data
}

const created = () => {
  get()
  cartridgeModal.value = false
}
onMounted(get)
</script>

<template>
  <div>
    <cartridge-list :cartridges="cartridges" class="my-12" />
    <u-dashboard-modal
      v-model="cartridgeModal"
      title="Add a cartridge"
      description="Choose the color of your cartridge"
      icon="i-mdi-cartridge"
      @close="cartridgeModal = false"
    >
      <cartridge-form @created="created" />
    </u-dashboard-modal>
  </div>
</template>
