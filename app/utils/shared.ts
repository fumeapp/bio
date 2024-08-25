import type { HeaderLink } from '@nuxt/ui-pro/types'
import type { CookieOptions } from '#app'

(BigInt.prototype as any).toJSON = function () { return this.toString() }

export const weekDays = [...Array(7)].map((_, i) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(1970, 0, 4 + i)),
)

export const weekdayToFull = (shortDay: string): string => {
  const index = weekDays.findIndex(day => day.toLowerCase() === shortDay.toLowerCase())
  if (index === -1)
    throw new Error(`Invalid short day: ${shortDay}`)
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(1970, 0, 4 + index))
}

export type HeaderIconLink = HeaderLink & { icon: string }

export const links: HeaderIconLink[] = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/home',
  },
  {
    label: 'Tokens',
    icon: 'i-mdi-key',
    to: '/tokens',
  },
  {
    label: 'Users',
    icon: 'i-mdi-account-multiple',
    to: '/users',
  },
  {
    label: 'Shots',
    icon: 'i-mdi-syringe',
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
