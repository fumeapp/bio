import type { ZodIssue } from 'zod'
import type { User } from '~/types/models'
import type { MetapiResponse } from '~/types/metapi'
import type { Form } from '#ui/types/form'
import type { UseFetchOptions } from '#app'

const user = ref<User | undefined>(undefined)
const silent = ref(false)

const form = ref<Form<any>>()

export const useApi = () => {
  const success = (message: string) =>
    useToast().add({ icon: 'i-mdi-check-bold', title: message, color: 'emerald', timeout: 2000 })

  const alert = (message: string, timeout = 12000) =>
    useToast().add({ icon: 'i-mdi-alert', title: message, color: 'red', timeout })

  const danger = (issues: string | ZodIssue[]) => {
    if (typeof issues === 'string')
      alert(issues)
    else
      issues.forEach((issue, index) => setTimeout(() =>
        alert(`Field: ${issue.path} Error: ${issue.message}`), 100 * (index + 1)),
      )
  }

  const fetch = $fetch.create({
    onResponse: ({ response }) => {
      if (silent.value) {
        silent.value = false
        return
      }
      if (response?._data?.meta.success && response?._data?.meta?.detail)
        success(response._data.meta.detail)
      if (!response?._data?.meta.success && response?._data?.meta?.detail)
        danger(response._data.meta.detail)
      if (!response?._data?.meta.success && response?._data?.meta?.detail && form.value)
        form.value?.setErrors(response._data.meta.detail.map((err: ZodIssue) => ({
          message: err.message,
          path: err.path[0],
        })))
    },
  })

  const api = <T>(
    url: string | (() => string),
    options?: Omit<UseFetchOptions<T>, 'default'> & { default: () => T | Ref<T> },
  ) => {
    return useFetch(url, {
      ...options,
      $fetch: fetch,
    })
  }

  const setForm = (frm?: Form<any>) => {
    form.value = frm
    return { fetch }
  }

  const setUser = (usr: User, token: string) => {
    user.value = usr
    const tokenCookie = useCookie('token', cookieOptions)
    tokenCookie.value = token
  }
  const checkUser = async () => {
    if (user.value) return

    silent.value = true
    try {
      const { data } = await fetch<MetapiResponse<User>>('/api/me')
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
    api,
    setUser,
    setForm,
    checkUser,
    user,
    logout,
    success,
  }
}
