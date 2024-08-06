export default defineEventHandler(async () => {
  return metapi().render(await prisma.user.findMany({
    include: {
      providers: true,
    },
  }))
})
