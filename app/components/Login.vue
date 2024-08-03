<script setup lang="ts">
const loading = ref(false)

interface Provider {
  name: string
  label: string
  icon: string
  color: string
  click: () => void
  loading: boolean
}

const providers: Provider[] = reactive([
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
  },
])

function login(name: string): void {
  const provider = providers.find(p => p.name === name)
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
</script>

<template>
  <UCard class="max-w-sm w-full backdrop-blur">
    <u-auth-form
      title="Authenticate"
      :providers="providers"
      :loading="loading"
      :fields="[{ name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email' }]"
    />
  </UCard>
</template>
