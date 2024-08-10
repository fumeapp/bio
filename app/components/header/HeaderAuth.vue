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
    to: '/token',
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
      <u-avatar
        v-if="user"
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
    <u-button v-else icon="i-mdi-login" label="Sign in" color="gray" @click="authModal = true" />
    <template #fallback>
      <u-skeleton class="w-20 h-8" />
    </template>
  </client-only>
</template>

<style scoped></style>
