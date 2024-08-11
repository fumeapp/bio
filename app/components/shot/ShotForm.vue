<script setup lang="ts">
import type { Pen, Shot } from '@prisma/client'
import type { Cartridge } from '~/types/models'
import type { Form } from '#ui/types/form'
import type { MetapiResponse } from '~/types/metapi'

import { shotUnits } from '~/utils/shared'

const props = defineProps<{ pen: Pen, cartridge?: Cartridge }>()

const emit = defineEmits(['created'])
const form = ref<Form<any>>()
const state = reactive({
  units: shotUnits[1],
})
const options = computed(() => {
  return shotUnits.map(units => ({ label: `${units} units - ${(props.cartridge.mg / 200 * units)}mg`, value: units }))
})

const create = async () => useApi()
  .setForm(form?.value)
  .fetch<MetapiResponse<Shot>>('/api/shot', { method: 'POST', body: state })
  .then(() => emit('created'))
</script>

<template>
  <u-form ref="form" :state="state" class="space-y-4" @submit="create">
    <span v-if="!cartridge"> Cartridge Required </span>
    <div v-else class="flex flex-col space-y-2 items-stretch">
      <u-select-menu
        v-model="state.units"
        value-attribute="value"
        :options="options"
      >
        <template #label>
          <div v-if="cartridge">
            {{ state.units }} units - {{ cartridge.mg / 4 }}mg
          </div>
        </template>
      </u-select-menu>
      <u-button block label="Log a Shot" icon="i-mdi-syringe" :disabled="!cartridge" />
    </div>
  </u-form>
</template>

<style scoped></style>
