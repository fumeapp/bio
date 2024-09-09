<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('_pages').findOne())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useCrumb().clear()

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
    <div v-else class="mx-auto max-w-3xl my-12">
      <div class="flex items-center space-x-3">
        <logo-bio class="w-52 h-52" />
        <div class="flex flex-col space-y-3">
          <logo-text class="text-9xl" large />
          <div class="text-center font-semibold uppercase tracking-[0.46em]">weight loss research resources</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
