export default defineEventHandler(async (event) => {

  return metapi.init().error(event, 'Error test')

  return metapi.init().render(await prisma.user.findMany({
      include: {
        providers: true,
      }
    }))
})