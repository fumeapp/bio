<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<Ref<NavItem[]>>('navigation')
</script>

<template>
  <u-main class="bg-gray-100 dark:bg-gray-950 overlay flex flex-col w-full">
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <UNavigationTree :links="mapContentNavigation(navigation[0].children)" />
          </UAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </u-main>
</template>
