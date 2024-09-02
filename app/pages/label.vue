<script setup lang="ts">
definePageMeta({
  layout: 'bare',
})
const dims = { width: 45, height: 20 }
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="flex items-center border border-white" :style="`width: ${dims.width * 5}mm; height: ${dims.height * 5}mm;` ">
      <logo-bio class="w-64 h-64" />
      <div class="flex flex-col space-y-3 my-3">
        <logo-text class="text-9xl" large />
        <div class="bg-sky-300 text-right w-full py-2 px-6 text-3xl font-extrabold">
          <span class="text-sky-700"> tirzepatide </span>
          <span class="text-sky-900"> 20mg </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
