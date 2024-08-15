export default authedEventHandler(async ({ user, event }) => {
  await prisma.token.delete({
    where: {
      userId: user.id,
      hash: user.hash,
    },
  })
  await clearUserSession(event)
  return metapi().success('logged out')
})
