<script lang="ts" setup>
const { confirming, params } = useConfirm()
function action(): void {
  confirming.value = false
  params.value.action()
}
</script>

<template>
  <u-modal v-model="confirming" :ui="{ width: 'sm:max-w-sm' }">
    <u-card>
      <template #header>
        <span class="font-semibold" v-html="params.title" />
      </template>
      <div v-html="params.message" />
      <template #footer>
        <div class="flex flex-row-reverse justify-start">
          <u-button color="red" variant="solid" class="ml-2" @click="action"> {{ params.label }}</u-button>
          <u-button color="white" @click="confirming = false"> Cancel </u-button>
        </div>
      </template>
    </u-card>
  </u-modal>
  <!--
      <u-notification icon="i-mdi-check-bold" color="emerald"  />
      <u-notification icon="i-mdi-check-bold" color="green"  />
      <u-notification icon="i-mdi-alert" color="red"  />
      <u-notification icon="i-mdi-cancel" color="red"  />
  -->
</template>
