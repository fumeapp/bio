<script setup lang="ts">
import type { Token } from '~/types/models'
import type { MetapiResponse } from '~/types/metapi'

const { data: page } = await useAsyncData('index', () => queryContent('/token').findOne())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})

const { set, fromLink } = useCrumb()
set(
  fromLink('Home'),
  fromLink('Tokens'),
)

const { data: tokens, refresh } = await useFetch<MetapiResponse<Token[]>>('/api/token')
</script>

<template>
  <token-list v-if="tokens?.data" :tokens="tokens.data" @reload="refresh" />
</template>
