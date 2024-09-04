<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { toc, seo } = useAppConfig()

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryContent()
  .where({ _extension: 'md', navigation: { $ne: false } })
  .only(['title', 'description', '_path'])
  .findSurround(withoutTrailingSlash(route.path)))

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})

defineOgImage({
  component: 'OgTitleDesc',
  title: page.value.title,
  description: page.value.description,
})

const headline = computed(() => findPageHeadline(page.value))
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :headline="headline"
    />

    <UPageBody prose>
      <ContentRenderer
        v-if="page.body"
        :value="page"
      />

      <hr v-if="surround?.length">

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page.toc !== false"
      #right
    >
      <UContentToc
        title="Table of Contents"
        :links="page.body?.toc?.links"
        :ui="{ wrapper: 'bg-transparent backdrop-blur-none' }"
      />
    </template>
  </UPage>
</template>
