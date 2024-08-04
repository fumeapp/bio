<script setup lang="ts"></script>

<template>
  <u-footer>
    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Copyright © {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </template>

    <template #right>
      <UColorModeButton size="sm" />

      <UButton
        to="https://github.com/fumeapp/bio"
        target="_blank"
        icon="i-mdi-github"
        aria-label="GitHub"
        color="gray"
        variant="ghost"
      />
    </template>
  </u-footer>
</template>

<style scoped></style>
