<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: pens, refresh: pensRefresh } = await useApi().api<MetapiResponse<Pen[]>>('/api/pen')
const { data: cartridges, refresh: cartridgesRefresh } = await useApi().api<MetapiResponse<Cartridge[]>>('/api/cartridge')

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})

const reload = async () => {
  await pensRefresh()
  await cartridgesRefresh()
}
</script>

<template>
  <div>
    <div
      v-if="pens.data.length === 0"
      class="w-full max-w-md mx-auto"
    >
      <u-alert
        icon="i-mdi-clock"
        title="Awaiting Implementation"
        description="We are still setting up your account, check back soon!"
        :actions="[{ label: 'Refresh', icon: 'i-mdi-refresh', onClick: reload, variant: 'solid' }]"
      />
    </div>
    <pen-list v-else :pens="pens.data" :cartridges="cartridges.data" readonly />
  </div>
</template>
