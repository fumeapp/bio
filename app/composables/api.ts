import type { User } from '@prisma/client'

const user = ref<User | undefined>(undefined)

export const useApi = () => {
  const setUser = (usr: User, token: string) => {
    user.value = usr
    const tkn = useCookie('token', { path: '/', httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 365 })
    tkn.value = token
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

  return {
    setUser,
    checkUser,
    user,
    logout,
  }
}
