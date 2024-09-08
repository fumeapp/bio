export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  await usePrisma(event).token.delete({
    where: {
      userId: user.id,
      hash: user.hash,
    },
  })
  await clearUserSession(event)
  return metapi().success('logged out')
})
