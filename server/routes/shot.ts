import { z } from 'zod'

const index = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  return metapi().render(
    await prisma.shot.findMany({
      where: {
        userId: user.id,
      },
    }),
  )
})

const create = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const schema = z.object({
    cartridge: z.string(),
    units: z.number(),
    date: z.string().date(),
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
  const schema = z.object({ id: z.number(), user: z.number() })
  const parsed = schema.safeParse({ id: event.context.params?.id })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)
  await prisma.shot.delete({
    where: {
      id: parsed.data.id,
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
