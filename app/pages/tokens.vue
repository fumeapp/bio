<script setup lang="ts">
import type { Token } from '@prisma/client'
import type { MetApiResponse } from '~/types/metapi'

const { data: page } = await useAsyncData('index', () => queryContent('/tokens').findOne())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})
const tokens = ref<Token[]>([])
const get = async () => {
  const { data } = await useApi().fetch<MetApiResponse<Token[]>>('/api/token')
  tokens.value = data
}

const testy = async () => {
  const { data } = await useApi().fetch<MetApiResponse<Token[]>>('/api/token/bob')
  console.log(data)
}

onMounted(get)
testy()
</script>

<template>
  <token-list :tokens="tokens" @reload="get" />
</template>

<style scoped></style>
