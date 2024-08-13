<script setup lang="ts">
defineProps<{ color: string }>()
</script>

<template>
  <div class="flex items-center relative">
    <div class="absolute left-3">
      <div class="opacity-95">
        <slot />
      </div>
    </div>
    <div class="w-2 h-12 rounded-l-sm" :class="`bg-${color}-500`" />
    <div
      class="w-[340px] h-14 rounded-l flex tems-center justify-end border-l border-t border-b"
      :class="`border-${color}-500`"
    />
    <div class="w-3 h-14 bg-gray-400" />
    <div class="w-1 h-14 bg-gray-500 rounded-r-sm" />
    <!--
    border-cyan-500
    border-sky-500
    border-teal-500
    border-blue-500
    border-pink-500
    border-gray-500

    bg-cyan-500/90
    -->
  </div>
</template>

<style scoped></style>
