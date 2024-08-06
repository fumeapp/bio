export default defineEventHandler(async () => {
  return metapi().render(auth.user())
})
