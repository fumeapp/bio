import { z } from 'zod'

const index = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user.isAdmin) return metapi().notFound(event)
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: Number.parseInt(event.context.params?.user as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().render(
    await prisma.shot.findMany({
      where: {
        userId: parsed.data.id,
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
  if (!user.isAdmin) return metapi().notFound(event)
  const schema = z.object({
    user: z.string(),
    cartridge: z.string(),
    units: z.number(),
    date: z.string().datetime(),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const shot = await prisma.shot.create({
    data: {
      cartridgeId: BigInt(parsed.data.cartridge),
      userId: BigInt(parsed.data.user),
      units: parsed.data.units,
      date: new Date(parsed.data.date),
    },
  })

  return metapi().success('shot logged', shot)
})

const remove = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user.isAdmin) return metapi().notFound(event)
  event = routing.routeParams(event, { user: 1, id: 3 })
  console.log('shots.remove', event.context.params)
  const schema = z.object({ id: z.string(), user: z.string() })
  const parsed = schema.safeParse({ id: event.context.params?.id, user: event.context.params?.user })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)
  await prisma.shot.delete({
    where: {
      userId: BigInt(parsed.data.user),
      id: BigInt(parsed.data.id),
    },
  })
  return metapi().success('shot deleted')
})

export default {
  index,
  create,
  remove,
}
