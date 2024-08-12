<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const { authModal } = useAuth()

const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})

const { user } = useApi()

const { data: pens, refresh: pensRefresh } = await useApi().api<MetapiResponse<Pen[]>>('/api/pen')
const { data: cartridges, refresh: cartridgesRefresh } = await useApi().api<MetapiResponse<Cartridge[]>>('/api/cartridge')

const reload = async () => {
  await pensRefresh()
  await cartridgesRefresh()
}
</script>

<template>
  <div v-if="!user" class="flex items-center justify-center pt-12">
    <u-button icon="i-mdi-login" label="Sign in" color="gray" size="xl" @click="authModal = true" />
  </div>
  <div
    v-else-if="user && pens?.data.length === 0"
    class="w-full max-w-md mx-auto"
  >
    <u-alert
      icon="i-mdi-clock"
      title="Awaiting Implementation"
      description="We are still setting up your account, check back soon!"
      :actions="[{ label: 'Refresh', icon: 'i-mdi-refresh', onClick: reload, variant: 'solid' }]"
    />
  </div>
  <pen-list v-else-if="pens && cartridges" :pens="pens?.data" :cartridges="cartridges?.data" readonly />
</template>
