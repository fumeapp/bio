<script setup lang="ts">
import type { Form } from '#ui/types/form'
import type { Round } from '@prisma/client'
import { format } from 'date-fns'
import type { MetapiResponse } from '~/types/metapi'
import { range } from '~/utils/shared'

const emit = defineEmits(['created', 'close'])

const route = useRoute()

const form = ref<Form<any>>()
const state = reactive<Round>({
  color: range.colors[0],
  content: range.contents[0],
  ml: range.mls[0],
  mg: range.mgs[1],
  portions: 4,
  frequency: 'weekly',
  date: format(new Date(), 'yyyy-MM-dd'),
})

const create = async () => useApi()
  .setForm(form?.value)
  .api<MetapiResponse<Round>>(`/api/user/${route.params.user}/round`, {
    method: 'POST',
    body: { ...state, date: new Date(`${state.date}T00:00:00`).toISOString() },
  })
  .then(() => emit('created'))
</script>

<template>
  <u-form ref="form" :state="state" class="space-y-4" @submit="create">
    <u-form-group label="Color" name="color" autofocus>
      <div class="flex items-center space-x-4">
        <div
          v-for="color in range.colors"
          :key="color"
          class="flex flex-col items-center space-y-2"
        >
          <u-button
            class="w-8 h-8 rounded-full"
            :variant="color === state.color ? 'solid' : 'outline'"
            :color="color"
            square
            @click="state.color = color"
          />
          <div class="text-xs"> {{ color }}</div>
        </div>
      </div>
    </u-form-group>

    <u-form-group label="Content" name="content" autofocus>
      <u-select-menu
        v-model="state.content"
        :options="range.contents"
      />
    </u-form-group>
    <u-form-group label="ML" name="ml" autofocus>
      <u-select-menu
        v-model="state.ml"
        :options="range.mls"
      />
    </u-form-group>
    <u-form-group label="MG" name="mg" autofocus>
      <u-select-menu
        v-model="state.mg"
        :options="range.mgs"
      />
    </u-form-group>

    <u-form-group label="Portions" name="portions">
      <u-input v-model="state.portions" type="number" label="Portions" />
    </u-form-group>
    <u-form-group label="Frequency" name="frequency">
      <u-input
        v-model="state.frequency"
        type="string"
      />
    </u-form-group>
    <u-form-group label="Date" name="content">
      <u-input v-model="state.date" type="date" label="Date" />
    </u-form-group>
    <div class="flex justify-end gap-3">
      <u-button label="Cancel" variant="soft" @click="emit('close')" />
      <u-button type="submit" label="Submit" variant="solid" color="primary" />
    </div>
  </u-form>
</template>
