import type { ZodIssue } from 'zod'
import type { Form } from '#ui/types/form'
import type { MetapiResponse } from '~/types/metapi'

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

  const api = $fetch.create({
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

  const setForm = (frm?: Form<any>) => {
    form.value = frm
    return { api }
  }

  return {
    api,
    setForm,
    success,
  }
}
