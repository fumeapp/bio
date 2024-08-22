import type { HeaderLink } from '@nuxt/ui-pro/types'
import type { CookieOptions } from '#app'

(BigInt.prototype as any).toJSON = function () { return this.toString() }

export type HeaderIconLink = HeaderLink & { icon: string }

export const toUtc = (date: string) => new Date((new Date(date)).getTime() + (new Date(date)).getTimezoneOffset() * 60000)

export const links: HeaderIconLink[] = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/home',
  },
  {
    label: 'Shots',
    icon: 'i-mdi-syringe',
    to: '/history',
  },
]

export const cookieOptions: CookieOptions & { readonly?: false } = {
  path: '/',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 365,
}

export const penColors = [
  'cyan',
  'sky',
  'teal',
  'blue',
  'pink',
  'gray',
]

export const cartridgeContents = [
  'Tirzepatide',
  'Retatrutide',
  'Semaglutide',
]

export const cartridgeMls = [
  '2.0',
  '3.0',
]

export const cartridgeMgs = [
  '10',
  '20',
  '30',
  '40',
]

export const shotUnits = [
  25,
  50,
]

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
