<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

/*
const { data: pens } = await useApi().api<MetapiResponse<Pen[]>>('/api/pen')
const { data: cartridges } = await useApi().api<MetapiResponse<Cartridge[]>>('/api/cartridge')
*/

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})
</script>

<template>
  <div>
    wtf
  </div>
</template>
