import { z } from 'zod'
import type { Cartridge } from '~/types/models'
import { cartridgeContents, cartridgeMgs, cartridgeMls } from '~/utils/shared'

const index = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user.isAdmin) return metapi().notFound(event)
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: Number.parseInt(event.context.params?.user as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().render(
    await prisma.cartridge.findMany({
      where: {
        userId: parsed.data.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        pen: true,
        shots: true,
      },
    }),
  )
})

const create = authedHandler(async ({ event }) => {
  const schema = z.object({
    user: z.string(),
    content: z.enum(cartridgeContents as [string, ...string[]]),
    ml: z.enum(cartridgeMls as [string, ...string[]]),
    mg: z.enum(cartridgeMgs as [string, ...string[]]),
  })
  const parsed = schema.safeParse({ user: event.context.params?.user, ...await readBody(event) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const cartridge = await prisma.cartridge.create({
    data: {
      content: parsed.data.content,
      ml: parsed.data.ml,
      mg: parsed.data.mg,
      userId: BigInt(parsed.data.user),
    },
    include: {
      pen: true,
      shots: true,
    },
  })

  return metapi().success('cartridge created', cartridge)
}, true)

const get = authedModelHandler<Cartridge>(async ({ model: cartridge }) => {
  return metapi().render(cartridge)
}, { admin: true, bindUser: false })

const remove = authedModelHandler<Cartridge>(async ({ model: cartridge }) => {
  await prisma.cartridge.delete({
    where: {
      id: cartridge.id,
    },
  })
  return metapi().success('cartridge deleted')
}, { admin: true, bindUser: false })

export default {
  index,
  create,
  get,
  remove,
}
