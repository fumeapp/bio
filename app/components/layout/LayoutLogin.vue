<script setup lang="ts">
import type { User } from '~/types/models'

interface Provider {
  name: string
  label: string
  icon: string
  color: string
  click: () => void
}

const providers = reactive<Provider[]>([
  {
    name: 'google',
    label: 'Google',
    icon: 'i-mdi-google',
    color: 'white',
    click: async () => await navigateTo('/api/oauth/google', { external: true }),
  },
  {
    name: 'microsoft',
    label: 'Microsoft',
    color: 'white',
    icon: 'i-mdi-microsoft',
    click: async () => await navigateTo('/api/oauth/microsoft', { external: true }),
  },
  {
    name: 'github',
    label: 'GitHub',
    color: 'white',
    icon: 'i-mdi-github',
    click: async () => await navigateTo('/api/oauth/github', { external: true }),
  },
])
</script>

<template>
  <div class="max-w-xs w-full mx-auto">
    <u-auth-form
      :providers="providers"
    />
  </Div>
</template>
