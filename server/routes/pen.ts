import { z } from 'zod'
import { penColors } from '~/utils/shared'

const index = defineEventHandler(async () => {
  return metapi().render(
    await prisma.pen.findMany({
      where: {
        userId: auth.user().id,
      },
    }),
  )
})

const create = defineEventHandler(async (event) => {
  const schema = z.object({
    color: z.enum(penColors as [string, ...string[]]),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().success('pen created')
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
      id: Number.parseInt(id),
      userId: auth.user().id,
    },
  })
  return metapi().success('token deleted')
})

export default {
  index,
  create,
  get,
  remove,
}
