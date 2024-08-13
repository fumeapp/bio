<script setup lang="ts">
import type { Cartridge, Pen } from '~/types/models'
import type { MetapiResponse } from '~/types/metapi'

const props = defineProps<{ pen: Pen, cartridges: Cartridge[], readonly?: boolean }>()

const emit = defineEmits(['reload'])

const attachModal = ref(false)

const reload = () => {
  attachModal.value = false
  emit('reload')
}

const options = computed(() => props.cartridges.filter(c => c.pen === null || c.pen?.id === props.pen.id)
  .map(c => ({ label: `${c.content} ${c.ml}ml ${c.mg}mg`, value: c.id })))

const cartridgeId = ref(props.pen.cartridgeId)
const dirty = computed(() => props.pen.cartridgeId !== cartridgeId.value)

const insert = () => useApi()
  .api<MetapiResponse<Cartridge>>(`/api/user/${props.pen.userId}/pen/${props.pen.id}`, { method: 'PUT', body: { cartridgeId: cartridgeId.value } })
  .then(reload)
const eject = () => useApi()
  .api<MetapiResponse<Cartridge>>(`/api/user/${props.pen.userId}/pen/${props.pen.id}`, { method: 'PUT' })
  .then(reload)
const remove = () => useApi()
  .api<MetapiResponse<Cartridge>>(`/api/user/${props.pen.userId}/pen/${props.pen.id}`, { method: 'DELETE' })
  .then(reload)

const items = computed(() => {
  return [
    [
      !props.pen.cartridge
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
        <u-dropdown v-if="!readonly" class="self-end" :items="items">
          <u-button icon="i-mdi-dots-vertical" size="xs" variant="ghost" />
        </u-dropdown>
        <pen-model :color="pen.color">
          <transition name="fade">
            <cartridge-model v-if="pen.cartridge" :cartridge="pen.cartridge" />
          </transition>
        </pen-model>
        <div v-if="pen.cartridge">
          {{ pen.cartridge.content }} {{ pen.cartridge.ml }}ml {{ pen.cartridge.mg }}mg
        </div>
        <div v-else>
          No cartridge attached
        </div>
        <div v-if="pen.cartridge && pen.cartridge.shots">
          <shot-summary :shots="pen.cartridge.shots" :cartridge="pen.cartridge" />
        </div>

        <shot-form :pen="pen" :cartridge="pen.cartridge" @created="reload" />
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
