export default defineEventHandler(async () => {
  /*
  await prisma.$queryRaw`UPDATE bio.users SET updatedAt = NOW() WHERE id = ${auth.user().id};`
  await prisma.$queryRaw`UPDATE bio.tokens SET updatedAt = NOW() WHERE hash = ${auth.hash()};`
  */
  await prisma.user.update({ where: { id: auth.user().id }, data: { updatedAt: new Date() } })
  await prisma.token.update({ where: { hash: auth.hash() }, data: { updatedAt: new Date() } })
  return metapi().render(auth.user())
})
