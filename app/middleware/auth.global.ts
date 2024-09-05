export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { loggedIn } = useUserSession()

  const gatedRoutes = [
    '/token',
    '/users',
  ]

  if (gatedRoutes.some(route => to.path.startsWith(route)))
    if (!loggedIn.value) return await navigateTo('/')
})
