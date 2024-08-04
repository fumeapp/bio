export default defineEventHandler(async (event) => {
  const gatedRoutes = [
    '/api/me',
  ]

  const cookies = parseCookies(event)
  if (authVerifyToken(useRuntimeConfig(event), cookies.token) === true)
    authSetUser(cookies.token)

  if (gatedRoutes.includes(getRequestURL(event).pathname))
    if (!authUser()) return metapi.init().error(event, 'Not Authenticated', 401)
})
