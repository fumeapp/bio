<script setup lang="ts">
const { authModal } = useAuth()
</script>

<template>
  <u-modal v-model="authModal" @close="authModal = false">
    <login />
  </u-modal>
</template>
