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
  events: rounds.value.data.flatMap((round: Round) => [
    {
      id: round.id,
      title: round.user.name,
      color: 'green',
      allday: true,
      start: round.date,
      end: round.date,
    },
    {
      id: round.id,
      title: round.user.name,
      color: 'blue',
      allday: true,
      start: useRound(round).lastShotDate(),
      end: useRound(round).lastShotDate(),
    },
    {
      id: round.id,
      title: round.user.name,
      color: 'red',
      allday: true,
      start: useRound(round).nextRoundDate(),
      end: useRound(round).nextRoundDate(),
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
    <u-dashboard-modal
      v-model="roundModal"
      :title="`${round?.content} ${round?.mg}mg`"
    >
      <div v-if="round">
        <div class="flex flex-1 items-center justify-between mb-8">
          <div class="flex space-x-2 items-center">
            <u-avatar :src="round.user.avatar" />
            <div>
              <div>{{ round.user.name }}</div>
              <div>{{ round.user.email }}</div>
            </div>
          </div>
          <round-summary :round="round" />
        </div>
      </div>
    </u-dashboard-modal>
  </div>
</template>

<style scoped></style>
