<script setup lang="ts">
import type { Cartridge } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

useCrumb().add('Cartridges')

const cartridgeModal = ref(false)
const cartridges = ref<Cartridge[]>([])

const get = async () => {
  const { data } = await useApi().fetch<MetapiResponse<Cartridge[]>>('/api/cartridge')
  cartridges.value = data
  console.log(cartridges.value)
}

const created = () => {
  get()
  cartridgeModal.value = false
}

onMounted(get)
</script>

<template>
  <div>
    <div class="flex justify-end -mt-[90px]">
      <u-button :ui="{ rounded: 'rounded-full' }" icon="i-mdi-plus" size="xs" @click="cartridgeModal = true" />
    </div>
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
