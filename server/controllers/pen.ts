import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { penPolicy } from '../policies/pen'
import type { Pen } from '~/types/models'
import { penColors } from '~/utils/shared'

const include = {
  cartridge: {
    include: {
      shots: {
        orderBy: { date: Prisma.SortOrder.asc },
      },
    },
  },
}

const index = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  return metapi().render(
    await prisma.pen.findMany({
      where: {
        userId: BigInt(user.id),
      },
      include,
      orderBy: {
        updatedAt: 'desc',
      },
    }),
  )
})

const create = authedHandler(async ({ user, event }) => {
  const schema = z.object({
    color: z.enum(penColors as [string, ...string[]]),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const pen = await prisma.pen.create({
    data: {
      color: parsed.data.color,
      userId: user.id,
      cartridgeId: null,
    },
    include,
  })

  return metapi().success('pen created', pen)
})

const update = authedModelHandler<Pen>(async ({ user, event, model: pen }) => {
  authorize(penPolicy.update, { user, pen })

  const schema = z.object({
    id: z.number(),
    color: z.enum(penColors as [string, ...string[]]),
    cartridgeId: z.number().optional(),
    shotDay: z.string().optional(),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse({
    id: Number.parseInt(event.context.params?.id as string),
    cartridgeId: Number.parseInt(body?.cartridgeId) || undefined,
    color: body?.color || penColors[0],
    shotDay: body?.shotDay || undefined,
  })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().success('pen updated', await prisma.pen.update({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      cartridgeId: parsed.data.cartridgeId ? BigInt(parsed.data.cartridgeId) : null,
      color: parsed.data.color,
      shotDay: parsed.data.shotDay || null,
    },
    include,
  }))
})

const get = authedModelHandler<Pen>(async ({ user, model: pen }) => {
  authorize(penPolicy.get, { user, pen })
  return metapi().render(pen)
}, { include })

const remove = authedModelHandler<Pen>(async ({ user, event, model: pen }) => {
  authorize(penPolicy.remove, { user, pen })

  if (pen?.cartridgeId !== null)
    return metapi().error(event, 'Cannot delete pen with cartridge', 400)

  await prisma.pen.delete({
    where: {
      id: pen.id,
      userId: user.id,
    },
  })
  return metapi().success('pen deleted')
})

export default {
  index,
  create,
  get,
  update,
  remove,
}
