import { z } from 'zod'
import { penColors } from '~/utils/shared'

const inc = {
  cartridge: {
    include: {
      shots: {
        orderBy: {
          date: 'asc',
        },
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
      include: inc,
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
    include: inc,
  })

  return metapi().success('pen created', pen)
})

const update = authedHandler(async ({ user, event }) => {
  const schema = z.object({
    id: z.number(),
    color: z.enum(penColors as [string, ...string[]]),
    cartridgeId: z.number().optional(),
  })
  const parsed = schema.safeParse({
    id: Number.parseInt(event.context.params?.id as string),
    cartridgeId: Number.parseInt((await readBody(event))?.cartridgeId) || undefined,
    color: (await readBody(event))?.color || penColors[0],
  })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const pen = await prisma.pen.update({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      cartridgeId: parsed.data.cartridgeId ? BigInt(parsed.data.cartridgeId) : null,
      color: parsed.data.color,
    },
    include: inc,
  })

  return metapi().success('pen updated', pen)
})

const get = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: Number.parseInt(event.context.params?.id as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)

  return metapi().renderNullError(event, await prisma.pen.findUnique({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    include: inc,
  }))
})

const remove = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = event.context.params?.id
  const pen = await prisma.pen.findFirst({
    where: {
      id: Number.parseInt(id as string),
      userId: user.id,
    },
  })

  if (pen?.cartridgeId !== null)
    return metapi().error(event, 'Cannot delete pen with cartridge', 400)

  await prisma.pen.delete({
    where: {
      id: Number.parseInt(id as string),
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
