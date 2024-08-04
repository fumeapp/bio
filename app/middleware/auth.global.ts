export default defineNuxtRouteMiddleware(async (_to, _from) => {
  if (import.meta.server) return
  await useApi().checkUser()
})
