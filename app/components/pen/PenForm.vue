<script setup lang="ts">
import type { Form } from '#ui/types/form'
import type { Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'
import { penColors } from '~/utils/shared'

const emit = defineEmits(['created', 'close'])

const route = useRoute()

const form = ref<Form<any>>()
const state = reactive({
  color: penColors[0],
  user: route.params.user,
})

const create = async () => useApi()
  .setForm(form?.value)
  .api<MetapiResponse<Pen>>(`/api/user/${route.params.user}/pen`, { method: 'POST', body: state })
  .then(() => emit('created'))
</script>

<template>
  <u-form ref="form" :state="state" class="space-y-4" @submit="create">
    <u-form-group label="Color" name="color" autofocus>
      <div class="flex items-center space-x-4">
        <div
          v-for="color in penColors"
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
    <pen-model v-if="state.color" :color="state.color" />
    <div class="flex justify-end gap-3">
      <u-button label="Cancel" variant="soft" @click="emit('close')" />
      <u-button type="submit" label="Submit" variant="solid" color="primary" />
    </div>
  </u-form>
</template>

<style scoped></style>
