<script setup lang="ts">
const { data: page } = await useAsyncData('terms', () => queryContent('_pages/terms').findOne())
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  titleTemplate: '| fume.bio',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})

defineOgImageComponent('OgTitleDesc', {
  title: page.value.title,
  description: page.value.description,
})
</script>

<template>
  <div>
    <u-page v-if="page">
      <UPageBody prose>
        <ContentRenderer
          v-if="page.body"
          :value="page"
        />
      </UPageBody>
    </u-page>
  </div>
</template>

<style scoped></style>
