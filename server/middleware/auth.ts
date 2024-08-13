export default defineEventHandler(async (event) => {
  const headers = {
    corssOriginOpenerPolicy: 'same-origin-allow-popups',
  }
  setHeaders(event, headers)
  const gatedRoutes = [
    'logout',
    '/api/me',
    '/api/token',
  ]

  const token = auth.bearer(event)
  if (token && auth.verify(useRuntimeConfig(event), token) === true)
    await auth.set(token)
  if (gatedRoutes.some(route => getRequestURL(event).pathname.startsWith(route)))
    if (!auth.user())
      return metapi().error(event, 'Not Authenticated', 401)
})
