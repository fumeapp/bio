<script setup lang="ts">
import type { Token } from '@prisma/client'
import { formatDistance } from 'date-fns'

const props = defineProps<{ token: Token & { client: UAParser.IResult, isCurrent: boolean } }>()

const emit = defineEmits(['reload'])

const { success } = useApi()
const { confirm } = useConfirm()
const remove = () => confirm('Delete Token', 'Are you sure you want to delete this token?', 'Delete', async () => {
  const { meta } = await $fetch(`/api/token/${props.token.id}`, {
    method: 'DELETE',
  })
  emit('reload')
  success(meta.detail)
  await useApi().checkUser()
})

if (import.meta.client)
  console.log(document.cookie)
</script>

<template>
  <u-card>
    <template #header>
      <div class="flex items-center justify-center relative">
        <u-button v-if="!token.isCurrent" icon="i-mdi-trash" color="red" size="xs" class="absolute top-0 right-0" variant="soft" @click="remove()" />
        <div v-if="token.client.os.name === 'Mac OS'" class="device device-mac" />
        <div v-else-if="token.client.os.name === 'Windows'" class="device device-windows" />
        <div v-else-if="token.client.os.name === 'Ubuntu'" class="device device-linux" />
        <div v-else-if="token.client.os.name === 'Linux'" class="device device-linux" />
        <div v-else-if="token.client.device.type === 'tablet' && token.client.os.name === 'iOS'" class="device device-ipad" />
        <div v-else-if="token.client.os.name === 'iOS'" class="device device-iphone" />
        <div v-else-if="token.client.os.name === 'Android OS'" class="device device-android-tablet" />
        <div v-else-if="token.client.os.name === 'Android'" class="device device-android" />
      </div>
    </template>
    <div class="flex flex-col space-y-2 text-gray-700 dark:text-gray-400 text-sm">
      <div class="flex items-center justify-between">
        <div class="text-lg">{{ token.client.os.name }} v{{ token.client.os.version }}</div>
        <u-icon v-if="token.isCurrent" name="i-mdi-check-decagram" class="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
      </div>
      <div class="flex items-center space-x-2">
        <u-icon name="i-mdi-application" />
        <div> {{ token.client.browser.name }} v{{ token.client.browser.version }}</div>
      </div>
      <div v-if="token.source === 'oauth:google'" class="flex items-center space-x-2">
        <u-icon name="i-mdi-google" />
        <div> Verified through Google </div>
      </div>
      <div v-if="token.source === 'oauth:github'" class="flex items-center space-x-2">
        <u-icon name="i-mdi-github" />
        <div> Verified through Github </div>
      </div>
      <div class="flex items-center space-x-2">
        <u-icon name="i-mdi-google-maps" />
        <div> {{ token.location.city }}, {{ token.location.region }} {{ token.location.country }} </div>
      </div>
      <div class="flex items-center space-x-2">
        <u-icon name="i-mdi-clock" />
        <div> Created {{ formatDistance(new Date(token.createdAt), new Date(), { addSuffix: true }) }} </div>
      </div>
      <div class="flex items-center space-x-2">
        <u-icon name="i-mdi-clock" />
        <div> Last Activity  {{ formatDistance(new Date(token.updatedAt), new Date(), { addSuffix: true }) }}</div>
      </div>
    </div>
  </u-card>
</template>

<style scoped>
.device {
  width: 72px;
  height: 72px;
}

.device-ipad {
  background: no-repeat url('/devices.png') 0 -950px;
  background-size: 72px 1532px;
}

.device-iphone {
  background: no-repeat url('/devices.png') 0 0;
  background-size: 72px 1532px;
}
.device-mac {
  background: no-repeat url('/devices.png') 0 -511px;
  background-size: 72px 1532px;
}

.device-windows {
  background: no-repeat url('/devices.png') 0 -1456px;
  background-size: 72px 1532px;
}

.device-android {
  background: no-repeat url('/devices.png') 0 -1314px;
  background-size: 72px 1532px;
}

.device-android-tablet {
  background: no-repeat url('/devices.png') 0 -1387px;
  background-size: 72px 1532px;
}

.device-linux {
  background: no-repeat url('/devices.png') 0 -1164px;
  background-size: 72px 1532px;
}
.device-postman {
  background: no-repeat url('https://calliditasblog.files.wordpress.com/2017/12/linuxpostman.png?w=72');
  background-size: 72px 1532px;
}

.device-other {
  display: none;
}
</style>
