export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const method = event.node.req.method

  // GET /
  if (!id && method === 'GET')
    return metapi.init().render({
      tokens: await prisma.$extends({
        result: {
          token: {
            isCurrent: {
              needs: { hash: true },
              compute({ hash }) { return hash === parseCookies(event).token },
            },
          },
        },
      }).token.findMany({
        where: {
          userId: auth.user().id,
        },
      }),
    })

  // GET /:id
  if (id && method === 'GET')
    return metapi.init().renderNullError(event, await prisma.token.findUnique({
      where: {
        id: Number.parseInt(id),
        userId: auth.user().id,
      },
    }))

  // DELETE /:id
  if (id && method === 'DELETE') {
    await prisma.token.delete({
      where: {
        id: Number.parseInt(id),
        userId: auth.user().id,
      },
    })
    return metapi.init().success('token deleted')
  }

  return metapi.init().render({
    id,
    method,
  })
})
