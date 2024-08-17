import { z } from 'zod'
import type { H3Event } from 'h3'
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

const create = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user.isAdmin) return metapi().notFound(event)
  const schema = z.object({
    user: z.string(),
    color: z.enum(penColors as [string, ...string[]]),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const pen = await prisma.pen.create({
    data: {
      color: parsed.data.color,
      userId: BigInt(parsed.data.user),
      cartridgeId: null,
    },
  })

  return metapi().success('pen created', pen)
})

const update = authedHandler(async ({ user, event }) => {
  const schema = z.object({
    id: z.number(),
    user: z.number(),
    cartridgeId: z.number().optional(),
  })

  event = routing.routeParams(event, { user: 1, id: 3 })

  const parsed = schema.safeParse({
    id: Number.parseInt(event.context.params?.id as string),
    user: Number.parseInt(event.context.params?.user as string),
    cartridgeId: Number.parseInt((await readBody(event))?.cartridgeId) || undefined,
  })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)

  const pen = await prisma.pen.update({
    where: {
      id: parsed.data.id,
      userId: parsed.data.user,
    },
    data: {
      cartridgeId: parsed.data.cartridgeId ? BigInt(parsed.data.cartridgeId) : null,
    },
  })

  return metapi().success('pen updated', pen)
}, true)

const get = authedModelHandler(async ({ model }: { model: Pen }) => {
  console.log('pens.get')
  return metapi().render(model)
}, { admin: true })

const remove = authedModelHandler(async ({ event, model }: { event: H3Event, model: Pen }) => {
  if (model?.cartridgeId !== null)
    return metapi().error(event, 'Cannot delete pen with cartridge', 400)

  await prisma.pen.delete({
    where: {
      id: model.id,
    },
  })
  return metapi().success('pen deleted')
}, { admin: true })

export default {
  index,
  create,
  get,
  update,
  remove,
}
