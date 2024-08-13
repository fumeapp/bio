<script setup lang="ts">
const emit = defineEmits(['loggedin'])
const { authModal } = useAuth()
const loggedin = () => {
  emit('loggedin')
  authModal.value = false
}
</script>

<template>
  <u-modal v-model="authModal" :ui="{ width: 'w-full sm:max-w-sm' }" @close="authModal = false">
    <div class="py-8 max-w-xs w-full mx-auto">
      <layout-login @loggedin="loggedin" />
    </div>
  </u-modal>
</template>
