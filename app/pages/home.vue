<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

useCrumb().clear()

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

const { loggedIn, user } = useUserSession()

const { data: pens, refresh: pensRefresh } = await useFetch<MetapiResponse<Pen[]>>(`/api/user/${user.value.id}/pen`)
const { data: cartridges, refresh: cartridgesRefresh } = await useFetch<MetapiResponse<Cartridge[]>>(`/api/user/${user.value.id}/cartridge`)

const reload = async () => {
  await pensRefresh()
  await cartridgesRefresh()
}
</script>

<template>
  <div>
    <div v-if="loggedIn && pens?.data.length === 0" class="w-full max-w-md mx-auto">
      <u-alert
        icon="i-mdi-clock"
        title="Awaiting Implementation"
        description="We are still setting up your account, check back soon!"
        :actions="[{ label: 'Refresh', icon: 'i-mdi-refresh', onClick: reload, variant: 'solid' }]"
      />
    </div>
    <pen-list v-else-if="pens && cartridges" :pens="pens?.data" :cartridges="cartridges?.data" readonly @reload="reload" />
  </div>
</template>
