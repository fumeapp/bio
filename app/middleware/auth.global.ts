export default defineNuxtRouteMiddleware(async (to, _from) => {
  console.log('checkUser', import.meta.server, to.path)
  if (import.meta.server) return
  await useApi().checkUser()

  useCrumb().init().add('Home')

  const gatedRoutes = [
    '/tokens',
    '/pens',
  ]
  if (gatedRoutes.some(route => to.path.startsWith(route)))
    if (!useApi().user.value) return '/'
})
