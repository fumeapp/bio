export default defineEventHandler(async (event) => {
  return metapi.i().r(await prisma.user.findMany({
      include: {
        providers: true,
      }
    }))
})