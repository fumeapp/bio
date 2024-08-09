<script setup lang="ts">
import type { Cartridge, Pen } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const props = defineProps<{ pen: Pen, cartridges: Cartridge[] }>()

const emit = defineEmits(['reload'])
const reload = () => emit('reload')

const options = computed(() => props.cartridges.map(c => ({ label: `${c.content} ${c.ml}ml`, value: c.id })))

const cartridgeId = ref(props.pen.cartridgeId)
const dirty = computed(() => props.pen.cartridgeId !== cartridgeId.value)
const insert = () => useApi()
  .fetch<MetapiResponse<Cartridge>>(`/api/pen/${props.pen.id}`, { method: 'PUT', body: { cartridgeId: cartridgeId.value } })
  .then(reload)
const remove = () => useApi()
  .fetch<MetapiResponse<Cartridge>>(`/api/pen/${props.pen.id}`, { method: 'PUT' })
  .then(reload)
const confirm = () => useConfirm().confirm('Remove Cartridge', 'Are you sure you want to remove this cartridge?', 'Remove', remove)
</script>

<template>
  <div>
    <u-card>
      <div class="flex flex-col items-center justify-center space-y-8">
        <pen-model :pen="pen">
          hi there
        </pen-model>
        <u-button-group>
          <u-select-menu
            v-model="cartridgeId"
            :options="options"
            placeholder="Insert a Cartridge"
            class="w-full"
            value-attribute="value"
          />
          <u-button v-if="dirty" icon="i-mdi-temperature-add" color="primary" @click="insert" />
          <u-button v-if="pen.cartridgeId" icon="i-mdi-trash" color="white" @click="confirm" />
        </u-button-group>
      </div>
    </u-card>
  </div>
</template>

<style scoped></style>
