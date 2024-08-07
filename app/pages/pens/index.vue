<script setup lang="ts">
import type { Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const penModal = ref(false)

const pens = ref<Pen[]>([])

const get = async () => {
  const { data } = await useApi().fetch<MetapiResponse<Pen[]>>('/api/pen')
  pens.value = data
}

onMounted(get)
</script>

<template>
  <div>
    <u-button label="Add a Pen" @click="penModal = true" />
    <u-card class="max-w-md mx-auto">
      <pen-form />
    </u-card>
    <u-dashboard-modal
      v-model="penModal"
      :title="penModal ? 'Edit Pen' : 'Create Pen'"
      :description="penModal ? 'Edit pen' : 'Create pen'"
      icon="i-mdi-pen"
      @close="penModal = false"
    >
      <pen-form />
    </u-dashboard-modal>
  </div>
</template>

<style scoped></style>
