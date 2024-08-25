<script setup lang="ts">
import type { Pen } from '~/types/models'

defineProps<{ pen: Pen }>()

const weekDays = [...Array(7)].map((_, i) => {
  const date = new Date(1970, 0, 4 + i)
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
})

const setShotDay = (day: string) => {
  props.pen.shotDay = day
}
</script>

<template>
  <div class="flex flex-col space-y-2 items-center">
    <u-button-group>
      <u-button
        v-for="day in weekDays"
        :key="day"
        :label="day"
        color="white"
        @click="setShotDay(day)"
      />
    </u-button-group>
    <span class="text-sm">Choose a shot day to help you remember</span>
  </div>
</template>

<style scoped></style>
