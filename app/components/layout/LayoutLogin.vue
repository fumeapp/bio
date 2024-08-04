<script setup lang="ts">
import type { User } from '@prisma/client'

const emit = defineEmits(['login'])
const loading = ref(false)
interface Provider {
  name: string
  label: string
  icon: string
  color: string
  click: () => void
  loading: boolean
}

const providers = reactive<Provider[]>([
  {
    name: 'google',
    label: 'Google',
    icon: 'i-mdi-google',
    color: 'white',
    click: () => login('google'),
    loading: false,
  },
  {
    name: 'github',
    label: 'GitHub',
    color: 'white',
    icon: 'i-mdi-github',
    click: () => login('github'),
    loading: false,
  },
])

function login(name: string): void {
  const provider = providers.find(p => p.name === name)
  if (!provider) return
  provider.loading = true
  const width = 640
  const height = 660
  const left = window.screen.width / 2 - (width / 2)
  const top = window.screen.height / 2 - (height / 2)
  const win = window.open(`${useRuntimeConfig().public.url}/api/redirect/${provider.name}`, 'Log In', `toolbar=no, location=no, directories=no, status=no, menubar=no, scollbars=no,
      resizable=no, copyhistory=no, width=${width},height=${height},top=${top},left=${left}`)
  const interval = setInterval(() => {
    if (win === null || win.closed) {
      clearInterval(interval)
      provider.loading = false
    }
  }, 200)
}

async function handleMessage(evt: { data: { user: User, token: string } }) {
  useApi().setUser(evt.data.user, evt.data.token)
  useApi().success('logged in')
  emit('login')
}

function messageHandler(add: boolean): void {
  if (add)
    return window.addEventListener('message', handleMessage)
  return window.removeEventListener('message', handleMessage)
}

if (import.meta.client) {
  onMounted(() => messageHandler(true))
  onBeforeUnmount(() => messageHandler(false))
}
</script>

<template>
  <u-auth-form
    :ui="{ title: 'text-center text-lg font-semibold' }"
    title="Sign in / Join"
    :providers="providers"
    :loading="loading"
    :fields="[{ name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email' }]"
  />
</template>
