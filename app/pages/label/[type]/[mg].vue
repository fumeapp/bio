<script setup lang="ts">
definePageMeta({ layout: 'bare' })
const dims = { width: 45, height: 20 }
const route = useRoute()
const { type, mg } = route.params
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div
      class="flex flex-col justify-center items-center space-y-3"
      :style="`width: ${dims.width * 5}mm; height: ${dims.height * 5}mm;`"
    >
      <div class="flex items-center space-x-3">
        <logo-bio class="w-52 h-52" />
        <div class="flex flex-col space-y-3">
          <logo-text class="text-9xl" large />
          <div class="flex text-5xl font-extrabold">
            <span class="text-sky-900 flex-1 text-center bg-sky-200 py-2 px-6"> {{ type }} </span>
            <span v-if="mg !== 'none'" class="text-sky-200 bg-sky-900 py-2 px-6"> {{ mg }}mg </span>
          </div>
        </div>
      </div>
      <div class="uppercase font-semibold tracking-wider text-xs">
        IN-VITRO LABORATORY RESEARCH USE ONLY.  NOT FOR HUMAN OR ANIMAL USE OR CONSUMPTION OF ANY KIND.
      </div>
    </div>
  </div>
</template>

<style scoped></style>
