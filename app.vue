<script lang="ts" setup>
import type { User } from '@prisma/client'

const providers = oauthProviders()
const users = ref<{ data: User[] }>()
const get = async () =>
  users.value = await $fetch<{ data: User[] }>('/api/user')
onMounted(get)
</script>

<template>
  <UContainer>
    <u-auth-form
      title="Login"
      :providers="providers"
      :fields="[{ name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email' }]"
    />
  </UContainer>
</template>
