export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  /*
  await prisma.$queryRaw`UPDATE bio.users SET updatedAt = NOW() WHERE id = ${auth.user().id};`
  await prisma.$queryRaw`UPDATE bio.tokens SET updatedAt = NOW() WHERE hash = ${auth.hash()};`
  */
  await prisma.user.update({ where: { id: user.id }, data: { updatedAt: new Date() } })
  await prisma.token.update({ where: { userId: user.id, hash: user.hash }, data: { updatedAt: new Date() } })
  return metapi().render(user)
})
