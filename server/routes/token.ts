import { z } from 'zod'

const index = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  return metapi().render(
    await prisma.$extends({
      result: {
        token: {
          isCurrent: {
            needs: { hash: true },
            compute({ hash }) { return hash === user.hash },
          },
        },
      },
    }).token.findMany({
      where: {
        userId: user.id,
      },
    }),
  )
})

const get = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: event.context.params?.id })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)

  return metapi().renderNullError(event, await prisma.token.findUnique({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
  }))
})

const remove = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = event.context.params?.id
  await prisma.token.delete({
    where: {
      id: Number.parseInt(id as string),
      userId: user.id,
    },
  })
  return metapi().success('token deleted')
})

export default {
  index,
  get,
  remove,
}
