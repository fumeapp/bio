export default defineEventHandler(async (event) => {
  const gatedRoutes = [
    'logout',
    '/api/me',
    '/api/token',
  ]
  console.log('gated', gatedRoutes.includes(getRequestURL(event).pathname))
  const cookies = parseCookies(event)
  if (authVerifyToken(useRuntimeConfig(event), cookies.token) === true)
    await authSetUser(cookies.token)

  if (gatedRoutes.some(route => getRequestURL(event).pathname.startsWith(route)))
    if (!authUser()) return metapi.init().error(event, 'Not Authenticated', 401)
})
