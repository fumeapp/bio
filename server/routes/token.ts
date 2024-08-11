import { z } from 'zod'

const index = defineEventHandler(async (event) => {
  console.log(parseCookies(event))
  return metapi().render(
    await prisma.$extends({
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
  )
})

const get = defineEventHandler(async (event) => {
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: event.context.params?.id })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)

  return metapi().renderNullError(event, await prisma.token.findUnique({
    where: {
      id: parsed.data.id,
      userId: auth.user().id,
    },
  }))
})

const remove = defineEventHandler(async (event) => {
  const id = event.context.params?.id
  await prisma.token.delete({
    where: {
      id: Number.parseInt(id as string),
      userId: auth.user().id,
    },
  })
  return metapi().success('token deleted')
})

export default {
  index,
  get,
  remove,
}
