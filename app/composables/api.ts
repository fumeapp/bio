import type { User } from '@prisma/client'
import type { CookieOptions } from '#app'

const cookieOptions: CookieOptions & { readonly?: false } = { path: '/', httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 365 }
const user = ref<User | undefined>(undefined)
const userToken = ref<string | undefined | null>(undefined)

export const useApi = () => {
  const setUser = (usr: User, token: string) => {
    user.value = usr
    const tokenCookie = useCookie('token', cookieOptions)
    tokenCookie.value = token
    userToken.value = token
  }
  const checkUser = async () => {
    try {
      const { data } = await $fetch('/api/me')
      user.value = data
      const tkn = useCookie('token', cookieOptions)
      userToken.value = tkn.value
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
    userToken,
    logout,
    success,
  }
}
