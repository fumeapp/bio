import type { CookieOptions } from '#app'

(BigInt.prototype as any).toJSON = function () { return this.toString() }

export const cookieOptions: CookieOptions & { readonly?: false } = { path: '/', httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 365 }
