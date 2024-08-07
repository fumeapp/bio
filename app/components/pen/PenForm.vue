<script setup lang="ts">
import type { Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'
import type { Form } from '#ui/types/form'
import { penColors } from '~/utils/shared'

const form = ref<Form<any>>()

const state = reactive({
  color: penColors[0],
})

const create = async () => useApi().setForm(form?.value).fetch<MetapiResponse<Pen>>('/api/pen', { method: 'POST', body: state })
</script>

<template>
  <u-form ref="form" :state="state" class="space-y-4" @submit="create">
    <u-form-group label="Color" name="color" :help="state.color" autofocus>
      <div class="flex items-center space-x-2">
        <u-button
          v-for="color in penColors"
          :key="color"
          class="w-8 h-8 rounded-full"
          :variant="color === state.color ? 'solid' : 'outline'"
          :color="color"
          square
          @click="state.color = color"
        />
      </div>
    </u-form-group>
    <div class="flex justify-end gap-3">
      <u-button label="Cancel" variant="soft" />
      <u-button type="submit" label="Submit" variant="solid" color="primary" />
    </div>
  </u-form>
</template>

<style scoped></style>
