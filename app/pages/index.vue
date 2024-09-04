<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('_pages').findOne())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { loggedIn } = useUserSession()

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
    <div v-if="loggedIn">
      <pen-user />
    </div>
  </div>
</template>

<style scoped></style>
