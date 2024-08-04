<script setup lang="ts">
const { authModal } = useAuth()
</script>

<template>
  <u-modal v-model="authModal" :ui="{ width: 'w-full sm:max-w-sm' }" @close="authModal = false">
    <div class="py-8 max-w-xs w-full mx-auto">
      <login @login="authModal = false" />
    </div>
  </u-modal>
</template>
