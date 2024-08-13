export default defineEventHandler(async (event) => {
  const gatedRoutes = [
    'logout',
    '/api/me',
    '/api/token',
  ]

  const bearer = (event.node.req.headers.authentication as string)?.split(' ')[1] || undefined
  if (bearer && auth.verify(useRuntimeConfig(event), bearer) === true)
    await auth.set(bearer)
  if (gatedRoutes.some(route => getRequestURL(event).pathname.startsWith(route)))
    if (!auth.user())
      return metapi().error(event, 'Not Authenticated', 401)
})
