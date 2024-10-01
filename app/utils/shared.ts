import type { HeaderLink } from '@nuxt/ui-pro/types'

(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export const weekDays = [...Array.from({ length: 7 })].map((_, i) =>
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
    icon: 'i-mdi-home',
    to: '/',
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
]

const colors = [
  'cyan',
  'sky',
  'teal',
  'blue',
  'pink',
  'gray',
]

const contents = [
  'Tirzepatide',
  'Cagrilintide',
]

const mls = [
  2,
  3,
]

const mgs = [
  5,
  10,
  20,
  30,
  40,
]

const units = [
  25,
  40,
  50,
]
export const range = {
  colors,
  contents,
  mls,
  mgs,
  units,
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
