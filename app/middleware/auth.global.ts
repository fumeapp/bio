export default defineNuxtRouteMiddleware(async (to, _from) => {
  // if (import.meta.server) return
  const token = useCookie('token', cookieOptions)
  await useApi().checkUser()

  useCrumb().init().add('Home')

  const gatedRoutes = [
    '/home',
    '/token',
    '/pen',
    '/cartridge',
    '/users',
  ]

  if (gatedRoutes.some(route => to.path.startsWith(route)))
    if (!useApi().user.value) return await navigateTo('/')
})
