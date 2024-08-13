<script setup lang="ts">
const { user } = await useUserSession()
const items = [
  [
    {
      label: '',
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Tokens',
      icon: 'i-mdi-key',
      shortcuts: ['T'],
      to: '/tokens',
    },
    {
      label: 'Users',
      icon: 'i-mdi-account-multiple',
      to: '/users',
      shortcuts: ['U'],
      disabled: !user.value?.isAdmin,
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-mdi-logout',
      click: () => useApi().logout(),
      shortcuts: ['L'],
    },
  ],
]
</script>

<template>
  <u-dropdown v-if="user" :items="items">
    <u-avatar
      :src="user.avatar"
      size="sm"
      icon="i-mdi-account-circle"
      :ui="{ rounded: 'bg-gray-200 dark:bg-gray-800' }"
    />
    <template #account>
      <div class="flex flex-col items-start">
        <div class="font-semibold text-gray-800 dark:text-gray-300">{{ user.name }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
      </div>
    </template>
  </u-dropdown>
</template>

<style scoped></style>
