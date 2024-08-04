export default defineNuxtRouteMiddleware(async (_to, _from) => {
  if (import.meta.server) return
  console.log('were doing it')
  await useApi().checkUser()
})
