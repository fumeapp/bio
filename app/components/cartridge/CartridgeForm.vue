<script setup lang="ts">
import type { Cartridge } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'
import type { Form } from '#ui/types/form'
import { cartridgeContents, cartridgeMgs, cartridgeMls } from '~/utils/shared'

const emit = defineEmits(['created', 'close'])
const form = ref<Form<any>>()
const state = reactive({
  content: cartridgeContents[0],
  ml: cartridgeMls[0],
  mg: cartridgeMgs[0],
})

const create = async () => useApi()
  .setForm(form?.value)
  .fetch<MetapiResponse<Cartridge>>('/api/cartridge', { method: 'POST', body: state })
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
    <u-form-group label="ML" name="ml" autofocus>
      <u-select-menu
        v-model="state.ml"
        :options="cartridgeMls"
      />
    </u-form-group>
    <u-form-group label="MG" name="mg" autofocus>
      <u-select-menu
        v-model="state.mg"
        :options="cartridgeMgs"
      />
    </u-form-group>
    <div class="flex justify-end gap-3">
      <u-button label="Cancel" variant="soft" @click="emit('close')" />
      <u-button type="submit" label="Submit" variant="solid" color="primary" />
    </div>
  </u-form>
</template>

<style scoped></style>
