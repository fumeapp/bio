<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<Ref<NavItem[]>>('navigation')
</script>

<template>
  <div>
    <header-main />
    <u-main class="flex flex-col w-full">
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
  </div>
</template>
