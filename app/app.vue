<script lang="ts" setup>
import type { ParsedContent } from '@nuxt/content'

const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', {
  default: () => [],
  server: false,
})

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({ titleTemplate: '%s - fume.bio' })

provide('navigation', navigation)
</script>

<template>
  <div class="overlay bg-gray-100 dark:bg-gray-950">
    <NuxtLoadingIndicator />
    <header-main />
    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
    <layout-footer />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>

    <layout-confirm />
    <u-notifications>
      <template #title="{ title }">
        <span v-html="title" />
      </template>
      <template #description="{ description }">
        <span v-html="description" />
      </template>
    </u-notifications>
  </div>
</template>

<style>
.top-\[--header-height\] {
    top: var(--header-height);
}

@media (min-width: 1024px) {
    .lg\:py-8 {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
}
.gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(50% 50% at 50% 50%, rgb(var(--color-primary-500) / 0.25) 0, #FFF 100%);
}

.dark {
  .gradient {
    background: radial-gradient(50% 50% at 50% 50%, rgb(var(--color-primary-400) / 0.1) 0, rgb(var(--color-gray-950)) 100%);
  }
}

.overlay {
  background-size: 100px 100px;
  background-image:
    linear-gradient(to right, rgb(var(--color-gray-200)) 0.5px, transparent 0.5px),
    linear-gradient(to bottom, rgb(var(--color-gray-200)) 0.5px, transparent 0.5px);
}
.dark {
  .overlay {
    background-image:
      linear-gradient(to right, rgb(var(--color-gray-900)) 0.5px, transparent 0.5px),
      linear-gradient(to bottom, rgb(var(--color-gray-900)) 0.5px, transparent 0.5px);
  }
}
</style>
