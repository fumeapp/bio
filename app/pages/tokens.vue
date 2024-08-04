<script setup lang="ts">
import type { Token } from '@prisma/client'

const { data: page } = await useAsyncData('index', () => queryContent('/tokens').findOne())
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})

const tokens = ref<Token[]>([])

const get = async () => {
  const { data } = await $fetch('/api/token')
  tokens.value = data.tokens
}

onMounted(get)
</script>

<template>
  <div class="m-12">
    <token-list :tokens="tokens" @reload="get" />
  </div>
</template>

<style scoped></style>
