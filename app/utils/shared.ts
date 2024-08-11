import type { HeaderLink } from '@nuxt/ui-pro/types'
import type { CookieOptions } from '#app'

(BigInt.prototype as any).toJSON = function () { return this.toString() }

export type HeaderIconLink = HeaderLink & { icon: string }

export const links: HeaderIconLink[] = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Users',
    icon: 'i-mdi-account',
    to: '/users',
  },
  /*
  {
    label: 'Pens',
    icon: 'i-mdi-pen',
    to: '/pens',
  },
  {
    label: 'Cartridges',
    to: '/cartridges',
    icon: 'i-mdi-bottle-soda-outline',
  },
  */
]

export const cookieOptions: CookieOptions & { readonly?: false } = {
  path: '/',
  httpOnly: true,
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
  '20',
  '30',
  '40',
]

export const shotUnits = [
  25,
  50,
]
