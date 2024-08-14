export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { loggedIn } = useUserSession()

  useCrumb().init().add('Home')

  const gatedRoutes = [
    '/home',
    '/token',
    '/users',
  ]

  if (gatedRoutes.some(route => to.path.startsWith(route)))
    if (!loggedIn.value) return await navigateTo('/')
})
