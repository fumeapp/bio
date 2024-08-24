<script setup lang="ts">
definePageMeta({ layout: 'bare' })
const { loggedIn } = useUserSession()

if (loggedIn.value) await navigateTo('/home')
</script>

<template>
  <div class="flex flex-col w-screen h-screen items-center justify-center">
    <logo-bio class="w-64 h-64" />
    <logo-text class="text-5xl mb-8" />
    <layout-login v-if="!loggedIn" />
    <u-button v-else class="w-28" icon="i-mdi-home" label="Home" to="/home" size="lg" color="gray" />
  </div>
</template>

<style scoped></style>
