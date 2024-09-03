<script setup lang="ts">
const loginModal = ref(false)
</script>

<template>
  <div>
    <u-button
      icon="i-mdi-login"
      label="Sign In"
      color="white"
      @click="loginModal = !loginModal"
    />
    <u-dashboard-modal v-model="loginModal" title="Sign In" description="Authenticate using one of the following providers ">
      <layout-login />
    </u-dashboard-modal>
  </div>
</template>

<style scoped></style>
