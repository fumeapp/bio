import { z } from 'zod'
import type { Cartridge } from '~/types/models'
import { cartridgeContents, cartridgeMgs, cartridgeMls } from '~/utils/shared'

const index = authedHandler(async ({ user }) => {
  return metapi().render(
    await prisma.cartridge.findMany({
      where: {
        userId: user.id,
      },
      include: {
        pen: true,
        shots: true,
      },
    }),
  )
})

const create = authedHandler(async ({ user, event }) => {
  const schema = z.object({
    content: z.enum(cartridgeContents as [string, ...string[]]),
    ml: z.enum(cartridgeMls as [string, ...string[]]),
    mg: z.enum(cartridgeMgs as [string, ...string[]]),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const cartridge = await prisma.cartridge.create({
    data: {
      content: parsed.data.content,
      ml: parsed.data.ml,
      mg: parsed.data.mg,
      userId: user.id,
    },
  })

  return metapi().success('cartridge created', cartridge)
})

const get = authedModelHandler<Cartridge>(async ({ event, user, model: cartridge }) => {
  if (Number(cartridge.userId) !== Number(user.id))
    return metapi().error(event, 'Unauthorized', 401)

  return metapi().render(cartridge)
})

const remove = authedModelHandler<Cartridge>(async ({ event, user, model: cartridge }) => {
  if (Number(cartridge.userId) !== Number(user.id))
    return metapi().error(event, 'Unauthorized', 401)
  await prisma.cartridge.delete({
    where: {
      id: cartridge.id,
      userId: user.id,
    },
  })
  return metapi().success('cartridge deleted')
})

export default {
  index,
  create,
  get,
  remove,
}
