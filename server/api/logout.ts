export default defineEventHandler(async (event) => {
  await prisma.token.delete({
    where: {
      userId: authUser().id,
      token: authToken(),
    },
  })
  deleteCookie(event, 'token')
  auth.clear()
  return metapi.init().success('logout successful')
})
