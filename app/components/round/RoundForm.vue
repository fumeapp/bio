<script setup lang="ts">
import type { Form } from '#ui/types/form'
import type { Round } from '@prisma/client'
import { format } from 'date-fns'
import type { MetapiResponse } from '~/types/metapi'

const emit = defineEmits(['created', 'close'])

const route = useRoute()

const form = ref<Form<any>>()
const state = reactive<Round>({
  content: cartridgeContents[0],
  ml: cartridgeMls[0],
  mg: cartridgeMgs[1],
  portions: 4,
  duration: 'weekly',
  date: format(new Date(), 'yyyy-MM-dd'),
})

const create = async () => useApi()
  .setForm(form?.value)
  .api<MetapiResponse<Pen>>(`/api/user/${route.params.user}/cycle`, {
    method: 'POST',
    body: { ...state, date: new Date(`${state.date}T00:00:00`).toISOString() },
  })
  .then(() => emit('created'))
</script>

<template>
  <u-form ref="form" :state="state" class="space-y-4" @submit="create">
    <u-form-group label="Content" name="content" autofocus>
      <u-select-menu
        v-model="state.content"
        :options="cartridgeContents"
      />
    </u-form-group>
    <u-form-group label="Portions" name="portions">
      <u-input v-model="state.portions" type="number" label="Portions" />
    </u-form-group>
    <u-form-group label="Duration" name="duration">
      <u-input
        v-model="state.duration"
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
