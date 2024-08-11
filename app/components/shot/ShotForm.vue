<script setup lang="ts">
import type { Shot } from '@prisma/client'
import { format } from 'date-fns'
import type { Pen } from '~/types/models'
import type { Form } from '#ui/types/form'
import type { MetapiResponse } from '~/types/metapi'

import { shotUnits } from '~/utils/shared'

const props = defineProps<{ pen: Pen }>()

const emit = defineEmits(['created'])
const form = ref<Form<any>>()
const state = reactive({
  user: props.pen.cartridge?.userId,
  cartridge: props.pen.cartridge?.id,
  units: shotUnits[1],
  date: format(new Date(), 'yyyy-MM-dd'),
})
const options = computed(() => {
  return shotUnits.map(units => ({ label: `${units} units - ${((props.pen.cartridge?.mg || 0) / 200 * units)}mg`, value: units }))
})

const create = async () => useApi()
  .setForm(form?.value)
  .fetch<MetapiResponse<Shot>>(`/api/cartridge/${props.pen.cartridge?.id}/shot`, { method: 'POST', body: state })
  .then(() => emit('created'))
</script>

<template>
  <u-form ref="form" :state="state" class="space-y-4" @submit="create">
    <span v-if="!pen.cartridge"> Cartridge Required </span>
    <u-button-group v-else orientation="vertical" class="w-52">
      <u-select-menu
        v-model="state.units"
        value-attribute="value"
        :options="options"
      >
        <template #label>
          <div v-if="pen.cartridge">
            {{ state.units }} units - {{ pen.cartridge.mg / 4 }}mg
          </div>
        </template>
      </u-select-menu>
      <u-input v-model="state.date" type="date" label="Date" />
      <u-button block label="Log a Shot" icon="i-mdi-syringe" :disabled="!pen.cartridge" @click="create" />
    </u-button-group>
  </u-form>
</template>

<style scoped></style>
