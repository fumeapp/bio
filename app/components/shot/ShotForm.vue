<script setup lang="ts">
import type { Shot } from '@prisma/client'
import { format } from 'date-fns'
import type { Pen } from '~/types/models'
import type { Form } from '#ui/types/form'
import type { MetapiResponse } from '~/types/metapi'
import { shotUnits } from '~/utils/shared'

const props = defineProps<{ pen: Pen }>()
const emit = defineEmits(['created'])
const route = useRoute()
const { user } = useUserSession()
const form = ref<Form<any>>()
const state = reactive({
  cartridgeId: props.pen.cartridge?.id,
  units: shotUnits[1],
  date: format(new Date(), 'yyyy-MM-dd'),
})
const options = computed(() =>
  shotUnits.map(units => ({
    label: `${units} units - ${((props.pen.cartridge?.mg as any || 0) / 200 * units)}mg`,
    value: units,
  })),
)

const create = async () => useApi()
  .setForm(form?.value)
  .api<MetapiResponse<Shot>>(
    `/api/user/${route.params.user ? route.params.user : user.value.id}/shot`,
    { method: 'POST', body: { ...state, date: new Date(`${state.date}T00:00:00`).toISOString() } },
  )
  .then(() => emit('created'))
</script>

<template>
  <u-form v-if="pen.cartridge" ref="form" :state="state" class="space-y-4" @submit="create">
    <u-button-group orientation="vertical" class="w-52">
      <u-select-menu
        v-model="state.units"
        value-attribute="value"
        :options="options"
      >
        <template #label>
          <div v-if="pen.cartridge">
            {{ state.units }} units - {{ (pen.cartridge.mg as unknown as number) / 200 * state.units }}mg
          </div>
        </template>
      </u-select-menu>
      <u-input v-model="state.date" type="date" label="Date" />
      <u-button block label="Log a Shot" icon="i-mdi-syringe" :disabled="!pen.cartridge" @click="create" />
    </u-button-group>
  </u-form>
</template>

<style scoped></style>
