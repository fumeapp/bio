import type { CookieOptions } from '#app'

(BigInt.prototype as any).toJSON = function () { return this.toString() }

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
