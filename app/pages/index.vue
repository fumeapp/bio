<script setup lang="ts">
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
defineOgImageComponent('OgLogo')
</script>

<template>
  <div>
    Landing page under construction
  </div>
</template>

<style scoped></style>
