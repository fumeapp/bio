<script setup lang="ts">
import type { CalendarOptions, EventClickArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { format } from 'date-fns'
import type { Round } from '~/types/models'

const { set, fromLink } = useCrumb()
set(
  fromLink('Home'),
  {
    label: 'Calendar',
    icon: 'i-mdi-calendar',
    to: '/calendar',
  },
)

const { data: rounds } = await useFetch('/api/rounds')

const mobile = import.meta.client ? window.innerWidth <= 800 : undefined

const roundModal = ref(false)
const round = ref<Round>()

const showRound = (roundId: string) => {
  round.value = rounds.value.data.find((round: Round) => round.id === Number.parseInt(roundId))
  roundModal.value = true
}

const options: CalendarOptions = {
  initialView: mobile ? 'listWeek' : 'dayGridMonth',
  themeSystem: 'bootstrap',
  dayHeaders: false,
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  height: 'auto',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: mobile ? '' : 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  timeZone: 'local',
  eventClick(event: EventClickArg) {
    showRound(event.event.id)
  },
  events: rounds.value.data.flatMap(round => [
    {
      id: round.id,
      title: `#${round.id} First shot`,
      color: round.color,
      allday: true,
      start: round.date,
      end: round.date,
    },
    {
      id: round.id,
      title: `#${round.id} last shot`,
      color: round.color,
      allday: true,
      start: useRound(round).lastShotDay(),
      end: useRound(round).lastShotDay(),
    },
  ]),
  // add classes 'row' and 'col-lg-12' to .fc-toolbar.fc-header-toolbar
  // to make it responsive
  // https://fullcalendar.io/docs/custom-view-with-vue
}
</script>

<template>
  <div px-2 py-4 lg:p-8>
    <full-calendar :options="options" />
    <u-dashboard-modal v-model="roundModal">
      <template v-if="round" #header>
        <div class="flex flex-1 items-center justify-between">
          <div class="flex space-x-2 items-center">
            <u-avatar :src="round.user.avatar" />
            <div>
              <div>{{ round.user.name }}</div>
              <div>{{ round.user.email }}</div>
            </div>
          </div>
          <div>
            {{ round.content }} {{ round.mg }}mg
          </div>
        </div>
      </template>
      <div v-if="round">
        <div>first shot {{ format(round.date, 'M/d/yy') }}</div>
        <div>last shot {{ format(useRound(round).lastShotDay(), 'M/d/yy') }}</div>
      </div>
    </u-dashboard-modal>
  </div>
</template>

<style scoped></style>
