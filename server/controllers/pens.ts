import { z } from 'zod'
import type { Pen } from '~/types/models'
import { penColors } from '~/utils/shared'

const index = authedHandler(async ({ event }) => {
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: Number.parseInt(event.context.params?.user as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().render(
    await prisma.pen.findMany({
      where: {
        userId: parsed.data.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        cartridge: {
          include: {
            shots: true,
          },
        },
      },
    }),
  )
}, true)

const create = authedHandler(async ({ event }) => {
  const schema = z.object({
    user: z.string(),
    color: z.enum(penColors as [string, ...string[]]),
  })
  const parsed = schema.safeParse({ user: event.context.params?.user, ...await readBody(event) })
  if (!parsed.success)
    return metapi().error(event, parsed.error.issues, 400)

  const pen = await prisma.pen.create({
    data: {
      color: parsed.data.color,
      userId: BigInt(parsed.data.user),
      cartridgeId: null,
    },
    include: {
      cartridge: {
        include: {
          shots: true,
        },
      },
    },
  })
  return metapi().success('pen created', pen)
}, true)

const update = authedModelHandler<Pen>(async ({ event, model: pen }) => {
  const schema = z.object({
    user: z.number(),
    cartridgeId: z.number().optional(),
    shotDay: z.string().optional(),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse({
    user: Number.parseInt(event.context.params?.user as string),
    cartridgeId: Number.parseInt(body?.cartridgeId) || undefined,
    shotDay: body?.shotDay || undefined,
  })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)

  const updatedPen = await prisma.pen.update({
    where: {
      id: pen.id,
      userId: parsed.data.user,
    },
    data: {
      cartridgeId: parsed.data.cartridgeId ? BigInt(parsed.data.cartridgeId) : null,
      shotDay: parsed.data.shotDay || null,
    },
  })

  return metapi().success('pen updated', updatedPen)
}, { requireAdmin: true })

const get = authedModelHandler<Pen>(async ({ model: pen }) => {
  return metapi().render(pen)
}, { requireAdmin: true })

const remove = authedModelHandler<Pen>(async ({ event, model: pen }) => {
  if (pen.cartridgeId !== null)
    return metapi().error(event, 'Cannot delete pen with cartridge', 400)

  await prisma.pen.delete({
    where: {
      id: pen.id,
    },
  })
  return metapi().success('pen deleted')
}, { requireAdmin: true })

export default {
  index,
  create,
  get,
  update,
  remove,
}
