<script setup lang="ts">
const { user } = useApi()
const { authModal } = useAuth()
const items = [
  [{
    label: '',
    slot: 'account',
    disabled: true,
  }],
  [{
    label: 'Tokens',
    icon: 'i-mdi-key',
    shortcuts: ['T'],
    to: '/tokens',
  }],
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
  <client-only>
    <u-dropdown v-if="user" :items="items">
      <u-avatar v-if="user" :src="user.avatar" size="sm" />
      <template #account>
        <div class="flex flex-col items-start">
          <div class="font-semibold text-gray-800 dark:text-gray-300">{{ user.name }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
        </div>
      </template>
    </u-dropdown>
    <u-button v-else label="Sign in" color="gray" @click="authModal = true" />
    <template #fallback>
      <u-skeleton class="w-8 h-8 rounded-full" />
    </template>
  </client-only>
</template>

<style scoped></style>
