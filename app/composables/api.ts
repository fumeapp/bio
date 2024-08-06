import type { User } from '@prisma/client'
import type { MetapiResponse } from '~/types/metapi'

const user = ref<User | undefined>(undefined)

export const useApi = () => {
  const success = (message: string) =>
    useToast().add({ icon: 'i-mdi-check-bold', title: message, color: 'emerald', timeout: 2000 })

  const fetch = $fetch.create({
    onResponse: ({ response }) => {
      if (response?._data?.meta?.detail)
        success(response._data.meta.detail)
    },
  })

  const setUser = (usr: User, token: string) => {
    user.value = usr
    const tokenCookie = useCookie('token', cookieOptions)
    tokenCookie.value = token
  }
  const checkUser = async () => {
    try {
      const { data } = await $fetch<MetapiResponse<User>>('/api/me')
      user.value = data
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {}
  }

  const logout = async () => {
    await fetch('/api/logout')
    user.value = undefined
    const tokenCookie = useCookie('token', cookieOptions)
    tokenCookie.value = undefined
    await navigateTo('/')
  }

  return {
    fetch,
    setUser,
    checkUser,
    user,
    logout,
    success,
  }
}
