export default defineEventHandler(async () => {
  return metapi.init().render(await prisma.user.findMany({
    include: {
      providers: true,
    },
  }))
})
