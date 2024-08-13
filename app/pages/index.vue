<script setup lang="ts">
const { authModal } = useAuth()
definePageMeta({ layout: 'bare' })
const { user } = useApi()
</script>

<template>
  <div class="flex flex-col w-screen h-screen items-center justify-center">
    <logo-bio class="w-64 h-64" />
    <logo-text class="text-5xl mb-8" />
    <client-only>
      <u-button v-if="!user" icon="i-mdi-login" label="Sign in" color="gray" size="lg" @click="authModal = true" />
      <u-button v-else icon="i-mdi-home" label="Home" to="/home" color="gray" />
      <template #fallback>
        <u-skeleton class="w-20 h-8" />
      </template>
    </client-only>
  </div>
</template>

<style scoped></style>
