<script setup lang="ts">
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

useCrumb().add('Users')

const { data: users, refresh } = await useApi().api<MetapiResponse<User>>('/api/user')
</script>

<template>
  <div>
    {{ users.data }}
    Page: users/index
  </div>
</template>

<style scoped></style>
