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
      <!--
      <pen-user />
      -->
    </div>
    <div v-else class="mx-auto max-w-3xl my-12">
      <div class="flex items-center justify-center space-x-3 w-full">
        <logo-bio class="w-24 h-24 lg:w-52 lg:h-52" />
        <div class="flex flex-col space-y-3">
          <logo-text class="text-6xl lg:text-9xl" large />
          <div class="text-center text-xs lg:text-base font-semibold uppercase lg:tracking-[0.46em]">weight loss research resources</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
