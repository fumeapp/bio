import { z } from 'zod'

const index = authedHandler(async ({ event }) => {
  const schema = z.object({ userId: z.number() })
  const parsed = schema.safeParse({ userId: Number.parseInt(event.context.params?.user as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().render(
    await prisma.shot.findMany({
      where: { userId: parsed.data.userId },
      include: {
        cartridge: {
          include: {
            pen: true,
          },
        },
      },
    }),
  )
}, true)

const create = authedHandler(async ({ event }) => {
  const schema = z.object({
    userId: z.string(),
    cartridge: z.string(),
    units: z.number(),
    date: z.string().datetime(),
  })
  const parsed = schema.safeParse({ userId: event.context.params?.user as string, ...await readBody(event) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  console.log('creating shot', parsed.data)
  return metapi().success('shot logged', await prisma.shot.create({
    data: {
      cartridgeId: BigInt(parsed.data.cartridge),
      userId: BigInt(parsed.data.userId),
      units: parsed.data.units,
      date: new Date(parsed.data.date),
    },
  }))
}, true)

const remove = authedHandler(async ({ event }) => {
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
}, true)

export default {
  index,
  create,
  remove,
}
