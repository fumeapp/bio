<script setup lang="ts">
definePageMeta({
  layout: 'bare',
})
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="flex items-start">
      <logo-bio class="w-52 h-52" />
      <div class="flex flex-col space-y-3 my-3">
        <logo-text class="text-8xl" />
        <div class="bg-sky-300 text-right w-full py-2 px-6 text-3xl font-extrabold">
          <span class="text-sky-700"> tirz </span>
          <span class="text-sky-900"> 20mg </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
