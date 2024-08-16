<script lang="ts" setup>
const { confirming, params } = useConfirm()
const primary = ref()
function action(): void {
  confirming.value = false
  params.value.action()
}

watch(confirming, () => {
  if (confirming.value)
    setTimeout(() => primary.value?.$el.focus(), 200)
})
</script>

<template>
  <u-dashboard-modal
    v-model="confirming"
    :title="params.title"
    :description="params.message"
    icon="i-mdi-alert-circle-outline"
    :ui="{
      icon: { base: 'text-red-500 dark:text-red-400' } as any,
    }"
  >
    <template #footer>
      <div class="flex flex-row-reverse justify-start">
        <u-button ref="primary" color="red" variant="solid" class="ml-2" @click="action"> {{ params.label }}</u-button>
        <u-button color="white" @click="confirming = false"> Cancel </u-button>
      </div>
    </template>
  </u-dashboard-modal>
  <!--
      <u-notification icon="i-mdi-check-bold" color="emerald"  />
      <u-notification icon="i-mdi-check-bold" color="green"  />
      <u-notification icon="i-mdi-alert" color="red"  />
      <u-notification icon="i-mdi-cancel" color="red"  />
  -->
</template>
