<script setup lang="ts">
const { user, clear } = await useUserSession()
const { fromLink } = useCrumb()

const logout = async () => {
  clear()
  useApi().api('/api/logout')
  await navigateTo('/')
}
const items = [
  [
    {
      email: user.value.email,
      name: user.value.name,
      slot: 'account',
      disabled: true,
    },
  ],
  [
    { shortcuts: ['T'], ...fromLink('Tokens') },
    { shortcuts: ['U'], disabled: !user.value.isAdmin, ...fromLink('Users') },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-mdi-logout',
      click: logout,
      shortcuts: ['L'],
    },
  ],
]
</script>

<template>
  <u-dropdown :items="items">
    <u-avatar
      :src="user.avatar"
      size="sm"
      icon="i-mdi-account-circle"
      :ui="{ rounded: 'bg-gray-200 dark:bg-gray-800' }"
    />
    <template #account="{ item }">
      <div class="flex flex-col items-start">
        <div class="font-semibold text-gray-800 dark:text-gray-300">{{ item.name }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.email }}</div>
      </div>
    </template>
  </u-dropdown>
</template>

<style scoped></style>
