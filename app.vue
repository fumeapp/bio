<script lang="ts" setup>
const get = async () => {
  const { users } = await $fetch('/api/user')
  console.log(users)
}

onMounted(get)
</script>

<template>
  <UContainer>
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          hi there
        </div>
      </template>
      <UButton icon="i-heroicons-book-open" to="https://ui.nuxt.com" target="_blank">Open Nuxt UI Documentation</UButton>
    </UCard>
  </UContainer>
</template>
