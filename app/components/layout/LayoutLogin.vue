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
  /*
  {
    name: 'x',
    label: 'X',
    icon: 'i-mdi-twitter',
    color: 'white',
    click: async () => await navigateTo('/api/oauth/x', { external: true }),
  },

  {
    name: 'instagram',
    label: 'Instagram',
    icon: 'i-mdi-instagram',
    color: 'white',
    click: async () => await navigateTo('/api/oauth/instagram', { external: true }),
  },

  {
    name: 'facebook',
    label: 'Facebook',
    icon: 'i-mdi-facebook',
    color: 'white',
    click: async () => await navigateTo('/api/oauth/facebook', { external: true }),
  },
  {
    name: 'microsoft',
    label: 'Microsoft',
    color: 'white',
    icon: 'i-mdi-microsoft',
    click: async () => await navigateTo('/api/oauth/microsoft', { external: true }),
  },
  */
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
  <div class="flex flex-col space-y-4">
    <u-button
      v-for="provider in providers"
      :key="provider.name"
      v-bind="provider"
      block
      size="lg"
      @click="provider.click"
    />
  </div>
</template>
