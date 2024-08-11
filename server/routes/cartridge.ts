import { z } from 'zod'
import { cartridgeContents, cartridgeMgs, cartridgeMls } from '~/utils/shared'

const index = defineEventHandler(async (event) => {
  if (!middleware.requireAuth()) return metapi().notFound(event)
  return metapi().render(
    await prisma.cartridge.findMany({
      where: {
        userId: auth.user().id,
      },
      include: {
        pen: true,
      },
    }),
  )
})

const create = defineEventHandler(async (event) => {
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
      userId: auth.user().id,
    },
  })

  return metapi().success('cartridge created', cartridge)
})

const get = defineEventHandler(async (event) => {
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: event.context.params?.id })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)

  return metapi().renderNullError(event, await prisma.cartridge.findUnique({
    where: {
      id: parsed.data.id,
      userId: auth.user().id,
    },
  }))
})

const remove = defineEventHandler(async (event) => {
  const id = event.context.params?.id
  await prisma.cartridge.delete({
    where: {
      id: Number.parseInt(id as string),
      userId: auth.user().id,
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
