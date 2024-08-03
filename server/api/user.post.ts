export default defineEventHandler((event) => {

  const user = prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'First Last',
    },
  })
  return 'Hello user.post'
})
