import type { CookieOptions } from '#app'

export const cookieOptions: CookieOptions & { readonly?: false } = { path: '/', httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 365 }
