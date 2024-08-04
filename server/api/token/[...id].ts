export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const method = event.node.req.method

  // GET /
  if (!id && method === 'GET')
    return metapi.init().render({
      tokens: await prisma.token.findMany({
        where: {
          userId: authUser().id,
        },
      }),
    })

  // GET /:id
  if (id && method === 'GET')
    return metapi.init().renderNullError(event, await prisma.token.findUnique({
      where: {
        id: Number.parseInt(id),
        userId: authUser().id,
      },
    }))

  // DELETE /:id
  if (id && method === 'DELETE') {
    await prisma.token.delete({
      where: {
        id: Number.parseInt(id),
        userId: authUser().id,
      },
    })
    return metapi.init().success('token deleted')
  }

  return metapi.init().render({
    id,
    method,
  })
})
