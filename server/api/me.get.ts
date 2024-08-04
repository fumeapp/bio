export default defineEventHandler(async () => {
  return metapi.init().render(auth.user())
})
