<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const penModal = ref(false)
const pens = ref<Pen[]>([])
const cartridges = ref<Cartridge[]>([])

useCrumb().add('Pens')

const get = async () => {
  const [p, c] = await Promise.all([
    useApi().fetch<MetapiResponse<Pen[]>>('/api/pen'),
    useApi().fetch<MetapiResponse<Cartridge[]>>('/api/cartridge'),
  ])
  pens.value = p.data
  cartridges.value = c.data
}

const created = () => {
  get()
  penModal.value = false
}

onMounted(get)
</script>

<template>
  <div>
    <div class="flex justify-end -mt-20">
      <u-button :ui="{ rounded: 'rounded-full' }" icon="i-mdi-plus" size="xs" @click="penModal = true" />
    </div>
    <pen-list :pens="pens" :cartridges="cartridges" class="my-12" @reload="get" />
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
