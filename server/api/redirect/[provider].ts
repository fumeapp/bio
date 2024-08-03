export default defineEventHandler((event) => {
  return `Hello redirect/${event.context.params.provider}`
})
