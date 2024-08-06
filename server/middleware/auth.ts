export default defineEventHandler(async (event) => {
  const gatedRoutes = [
    'logout',
    '/api/me',
    '/api/token',
  ]
  const cookies = parseCookies(event)
  if (cookies.token && auth.verify(useRuntimeConfig(event), cookies.token) === true)
    await auth.set(cookies.token)

  if (gatedRoutes.some(route => getRequestURL(event).pathname.startsWith(route)))
    if (!auth.user())
      return metapi().error(event, 'Not Authenticated', 401)
})
