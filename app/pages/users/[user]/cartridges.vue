<script setup lang="ts">
import type { Cartridge } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

const route = useRoute()
const cartridgeModal = ref(false)
const { data: user } = await useApi().api<MetapiResponse<User>>(`/api/user/${route.params.user}`)
useCrumb()
  .add('Users')
  .custom({
    label: user.value.data.name as string,
    icon: 'i-mdi-account',
  })
  .custom({
    label: 'Cartridges',
    icon: 'i-mdi-bottle-soda-outline',
  })
  .action({ label: 'Add a Cartridge', click: () => cartridgeModal.value = true })

const { data: cartridges, refresh } = await useApi().api<MetapiResponse<Cartridge[]>>(`/api/user/${route.params.user}/cartridge`)

const created = () => {
  refresh()
  cartridgeModal.value = false
}
</script>

<template>
  <div>
    <cartridge-list :cartridges="cartridges.data" />
    <u-dashboard-modal
      v-model="cartridgeModal"
      title="Add a cartridge"
      description="Choose the color of your cartridge"
      icon="i-mdi-cartridge"
      @close="cartridgeModal = false"
    >
      <cartridge-form @created="created" @close="cartridgeModal = false" />
    </u-dashboard-modal>
  </div>
</template>
