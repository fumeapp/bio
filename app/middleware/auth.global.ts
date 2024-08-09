export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (import.meta.server) return
  await useApi().checkUser()

  useCrumb().init().add('Home')

  const gatedRoutes = [
    '/token',
    '/pen',
    '/cartridge',
  ]
  console.log('startsWith', gatedRoutes.some(route => to.path.startsWith(route)))
  if (gatedRoutes.some(route => to.path.startsWith(route)))
    if (!useApi().user.value) return '/'
})
