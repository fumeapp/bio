export default defineEventHandler(async (event) => {
  await prisma.token.delete({
    where: {
      userId: auth.user().id,
      hash: auth.hash(),
    },
  })
  deleteCookie(event, 'token')
  auth.clear()
  return metapi().success('logged out')
})
