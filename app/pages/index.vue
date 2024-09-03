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
  <div class="w-full h-full flex-1 flex items-center justify-center">
    <u-icon
      name="i-mdi-construction"
      class="w-24 h-24"
    />
  </div>
</template>

<style scoped></style>
