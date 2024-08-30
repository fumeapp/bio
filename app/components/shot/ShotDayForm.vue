<script setup lang="ts">
import type { Pen } from '~/types/models'

const props = defineProps<{ pen: Pen }>()

const emit = defineEmits(['updated'])
const route = useRoute()

const isShotDayToday = computed((): boolean =>
  weekDays[new Date().getDay()]?.toLowerCase() === props.pen.shotDay?.toLowerCase(),
)

const lastShot = computed(() => props.pen?.cartridge?.shots?.at(-1) ?? null)

const hasTakenShotOnShotDay = computed((): boolean => {
  if (!isShotDayToday.value) return false

  if (!lastShot.value) return false

  const today = new Date()
  const lastShotDate = new Date(lastShot.value.date)

  return (
    today.getDate() === lastShotDate.getDate()
    && today.getMonth() === lastShotDate.getMonth()
    && today.getFullYear() === lastShotDate.getFullYear()
  )
})
const update = (day?: string) => {
  useApi()
    .api(
      route.params.user ? `/api/user/${route.params.user}/pen/${props.pen.id}` : `/api/pen/${props.pen.id}`,
      { method: 'PUT', body: { cartridgeId: props.pen.cartridgeId, shotDay: day || undefined } },
    )
    .then(() => emit('updated'))
}
</script>

<template>
  <div v-if="!pen.shotDay" class="flex flex-col space-y-2 items-center">
    <u-button-group>
      <u-button
        v-for="day in weekDays"
        :key="day"
        :label="day"
        color="white"
        @click="update(day)"
      />
    </u-button-group>
    <span class="text-sm">Choose a shot day to help you remember</span>
  </div>
  <div v-else class="flex items-center space-x-1">
    <span> Your shot day is </span>
    <u-badge :label="weekdayToFull(pen.shotDay)" variant="soft" size="lg" />
    <u-button :ui="{ rounded: 'rounded-full' }" icon="i-mdi-close" size="xs" variant="ghost" square @click="update()" />
  </div>
  <u-alert
    v-if="hasTakenShotOnShotDay"
    icon="i-mdi-check"
    title="You've taken your shot today!" color="emerald"
  />
  <u-alert
    v-else-if="isShotDayToday"
    icon="i-mdi-alert"
    title="Shot day is today"
    description="Don't forget to take your shot and log it!"
    color="sky"
  />
</template>

<style scoped></style>
