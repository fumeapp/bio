<script setup lang="ts">
const state = reactive({
  label: undefined,
  color: undefined,
})
</script>

<template>
  <u-form :state="state" class="space-y-4" @submit="console.log(state)">
    <u-form-group label="Label" name="label" autofocus>
      <u-input v-model="state.label" placeholder="Pinky" />
    </u-form-group>
    <div class="flex justify-end gap-3">
      <u-button label="Cancel" variant="soft" @click="$emit('close')" />
      <u-button type="submit" label="Submit" variant="solid" color="primary" />
    </div>
  </u-form>
</template>

<style scoped></style>
