import { z } from 'zod'
import type { Pen } from '~/types/models'
import { penColors } from '~/utils/shared'

const index = authedHandler(async ({ user, event }) => {
  if (!user.isAdmin) return metapi().notFound(event)
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
  })

  const parsed = schema.safeParse({
    user: Number.parseInt(event.context.params?.user as string),
    cartridgeId: Number.parseInt((await readBody(event))?.cartridgeId) || undefined,
  })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)

  const updatedPen = await prisma.pen.update({
    where: {
      id: pen.id,
      userId: parsed.data.user,
    },
    data: {
      cartridgeId: parsed.data.cartridgeId ? BigInt(parsed.data.cartridgeId) : null,
    },
  })

  return metapi().success('pen updated', updatedPen)
}, true)

const get = authedModelHandler<Pen>(async ({ model: pen }) => {
  return metapi().render(pen)
}, { admin: true, bindUser: false })

const remove = authedModelHandler<Pen>(async ({ event, model: pen }) => {
  if (pen.cartridgeId !== null)
    return metapi().error(event, 'Cannot delete pen with cartridge', 400)

  await prisma.pen.delete({
    where: {
      id: pen.id,
    },
  })
  return metapi().success('pen deleted')
}, { admin: true, bindUser: false })

export default {
  index,
  create,
  get,
  update,
  remove,
}
