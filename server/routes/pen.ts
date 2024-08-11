import { z } from 'zod'
import { penColors } from '~/utils/shared'

const index = defineEventHandler(async (event) => {
  if (!middleware.requireAuth()) return metapi().notFound(event)
  return metapi().render(
    await prisma.pen.findMany({
      where: {
        userId: BigInt(auth.user().id),
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
})

const create = defineEventHandler(async (event) => {
  const schema = z.object({
    color: z.enum(penColors as [string, ...string[]]),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const pen = await prisma.pen.create({
    data: {
      color: parsed.data.color,
      // user: { connect: { id: BigInt(auth.user().id) } },
      userId: BigInt(auth.user().id),
      cartridgeId: null,
    },
  })

  return metapi().success('pen created', pen)
})

const update = defineEventHandler(async (event) => {
  const schema = z.object({
    id: z.number(),
    cartridgeId: z.number().optional(),
  })
  const parsed = schema.safeParse({
    id: Number.parseInt(event.context.params?.id as string),
    cartridgeId: Number.parseInt((await readBody(event))?.cartridgeId) || undefined,
  })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  console.log(parsed.data)
  const pen = await prisma.pen.update({
    where: {
      id: parsed.data.id,
      userId: BigInt(auth.user().id),
    },
    data: {
      cartridgeId: parsed.data.cartridgeId ? BigInt(parsed.data.cartridgeId) : null,
    },
  })

  return metapi().success('pen updated', pen)
})

const get = defineEventHandler(async (event) => {
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: Number.parseInt(event.context.params?.id as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)

  return metapi().renderNullError(event, await prisma.pen.findUnique({
    where: {
      id: parsed.data.id,
      userId: BigInt(auth.user().id),
    },
  }))
})

const remove = defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const pen = await prisma.pen.findFirst({
    where: {
      id: Number.parseInt(id as string),
      userId: BigInt(auth.user().id),
    },
  })

  if (pen?.cartridgeId !== null)
    return metapi().error(event, 'Cannot delete pen with cartridge', 400)

  await prisma.pen.delete({
    where: {
      id: Number.parseInt(id as string),
      userId: BigInt(auth.user().id),
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
