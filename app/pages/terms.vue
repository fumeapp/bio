<script setup lang="ts">
const { data: page } = await useAsyncData('terms', () => queryContent('/terms').findOne())
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})

console.log(page)
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
