<script setup lang="ts">
import type { Pen, Shot } from '@prisma/client'
import type { Cartridge } from '~/types/models'
import type { Form } from '#ui/types/form'
import type { MetapiResponse } from '~/types/metapi'

import { shotUnits } from '~/utils/shared'

defineProps<{ pen: Pen, cartridge?: Cartridge }>()

const emit = defineEmits(['created'])
const form = ref<Form<any>>()
const state = reactive({
  units: shotUnits[1],
})

const create = async () => useApi()
  .setForm(form?.value)
  .fetch<MetapiResponse<Shot>>('/api/shot', { method: 'POST', body: state })
  .then(() => emit('created'))
</script>

<template>
  <u-form ref="form" :state="state" class="space-y-4" @submit="create">
    <span v-if="!cartridge"> Cartridge Required </span>
    <u-button-group v-else>
      <u-select-menu
        v-model="state.units"
        :options="shotUnits"
      />
      <u-button label="Log a Shot" icon="i-mdi-syringe" :disabled="!cartridge" />
    </u-button-group>
  </u-form>
</template>

<style scoped></style>
