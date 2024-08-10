<script setup lang="ts">
import type { Pen } from '@prisma/client'
import type { Cartridge } from '~/types/models'
import type { MetapiResponse } from '~/types/metapi'

const props = defineProps<{ pen: Pen, cartridges: Cartridge[] }>()

const emit = defineEmits(['reload'])

const attachModal = ref(false)

const reload = () => {
  attachModal.value = false
  emit('reload')
}

const options = computed(() => props.cartridges.filter(c => c.pen === null || c.pen.id === props.pen.id)
  .map(c => ({ label: `${c.content} ${c.ml}ml ${c.mg}mg`, value: c.id })))
const cartridge = computed(() => props.cartridges.find(c => c.id === props.pen.cartridgeId) || undefined)

const cartridgeId = ref(props.pen.cartridgeId)
const dirty = computed(() => props.pen.cartridgeId !== cartridgeId.value)

const insert = () => useApi()
  .fetch<MetapiResponse<Cartridge>>(`/api/pen/${props.pen.id}`, { method: 'PUT', body: { cartridgeId: cartridgeId.value } })
  .then(reload)
const eject = () => useApi()
  .fetch<MetapiResponse<Cartridge>>(`/api/pen/${props.pen.id}`, { method: 'PUT' })
  .then(reload)
const remove = () => useApi()
  .fetch<MetapiResponse<Cartridge>>(`/api/pen/${props.pen.id}`, { method: 'DELETE' })
  .then(reload)

const items = computed(() => {
  return [
    [
      !cartridge.value
        ? {
            label: 'Attach Cartridge',
            icon: 'i-mdi-plus',
            click: () => attachModal.value = true,
          }
        : {
            label: 'Eject Cartridge',
            icon: 'i-mdi-minus',
            click: () => useConfirm().confirm('Remove Cartridge', 'Are you sure you want to remove this cartridge?', 'Eject', eject),
          },
    ],
    [
      {
        label: 'Delete pen',
        icon: 'i-mdi-trash',
        click: () => useConfirm().confirm('Remove Cartridge', 'Are you sure you want to delete this pen?', 'Remove', remove),
      },
    ],
  ]
})
</script>

<template>
  <div class="flex">
    <u-card class="w-full">
      <div class="flex flex-col items-center justify-center space-y-8">
        <u-dropdown class="self-end" :items="items">
          <u-button icon="i-mdi-dots-vertical" size="xs" variant="ghost" />
        </u-dropdown>
        <pen-model :pen="pen">
          <transition name="fade">
            <cartridge-model v-if="cartridge" :cartridge="cartridge" />
          </transition>
        </pen-model>

        <shot-form :pen="pen" :cartridge="cartridge" @created="reload" />
      </div>
    </u-card>
    <u-dashboard-modal v-model="attachModal" title="Attach a Cartridge" description="Choose an available cartridge">
      <u-button-group>
        <u-select-menu
          v-model="cartridgeId"
          :options="options"
          placeholder="Choose a Cartridge"
          value-attribute="value"
        />
        <u-button icon="i-mdi-plus" label="Attach" size="xs" :disabled="!dirty" @click="insert" />
      </u-button-group>
    </u-dashboard-modal>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
