export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (import.meta.server) return
  await useApi().checkUser()

  const gatedRoutes = [
    '/tokens',
  ]
  if (gatedRoutes.some(route => to.path.startsWith(route)))
    if (!useApi().user.value) return '/'
})
