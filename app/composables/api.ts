import type { User } from '@prisma/client'

const user = ref<User | undefined>(undefined)

export const useApi = () => {
  const setUser = (usr: User, token: string) => {
    user.value = usr
    const tokenCookie = useCookie('token', cookieOptions)
    tokenCookie.value = token
  }
  const checkUser = async () => {
    try {
      const { data } = await $fetch('/api/me')
      user.value = data
    }
    catch (e) {}
  }

  const logout = async () => {
    await $fetch('/api/logout')
    user.value = undefined
  }

  const success = (message: string) =>
    useToast().add({ icon: 'i-mdi-check-bold', title: message, color: 'emerald', timeout: 2000 })

  return {
    setUser,
    checkUser,
    user,
    logout,
    success,
  }
}
