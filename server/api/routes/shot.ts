import { z } from 'zod'
import { format } from 'date-fns'

const index = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  return metapi().render(
    await prisma.shot.findMany({
      where: {
        userId: user.id,
      },
      include: {
        cartridge: {
          include: {
            pen: true,
          },
        },
      },
    }),
  )
})

const create = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const schema = z.object({
    cartridge: z.string(),
    units: z.number(),
    date: z.string().datetime(),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const shot = await prisma.shot.create({
    data: {
      cartridgeId: BigInt(parsed.data.cartridge),
      userId: user.id,
      units: parsed.data.units,
      date: new Date(parsed.data.date),
    },
  })

  return metapi().success('shot logged', shot)
})

const remove = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const schema = z.object({ id: z.string() })
  const parsed = schema.safeParse({ id: event.context.params?.id })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)
  await prisma.shot.delete({
    where: {
      id: BigInt(parsed.data.id),
      userId: user.id,
    },
  })
  return metapi().success('shot deleted')
})

export default {
  index,
  create,
  remove,
}
