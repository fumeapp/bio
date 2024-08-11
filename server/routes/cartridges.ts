import { z } from 'zod'
import { cartridgeContents, cartridgeMgs, cartridgeMls } from '~/utils/shared'

const index = defineEventHandler(async (event) => {
  if (!middleware.requireAdmin()) return metapi().notFound(event)
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: Number.parseInt(event.context.params?.user as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().render(
    await prisma.cartridge.findMany({
      where: {
        userId: parsed.data.id,
      },
      include: {
        pen: true,
      },
    }),
  )
})

const create = defineEventHandler(async (event) => {
  if (!middleware.requireAdmin()) return metapi().notFound(event)
  const schema = z.object({
    user: z.string(),
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
      userId: BigInt(parsed.data.user),
    },
  })

  return metapi().success('cartridge created', cartridge)
})

const get = defineEventHandler(async (event) => {
  if (!middleware.requireAdmin()) return metapi().notFound(event)
  const schema = z.object({ id: z.number(), user: z.number() })
  const parsed = schema.safeParse({
    id: event.context.params?.id,
    user: Number.parseInt(event.context.params?.user as string),
  })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)

  return metapi().renderNullError(event, await prisma.cartridge.findUnique({
    where: {
      id: parsed.data.id,
      userId: BigInt(parsed.data.id),
    },
  }))
})

const remove = defineEventHandler(async (event) => {
  if (!middleware.requireAdmin()) return metapi().notFound(event)
  const schema = z.object({ id: z.number(), user: z.number() })
  const parsed = schema.safeParse({ id: event.context.params?.id, user: Number.parseInt(event.context.params?.user as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)
  await prisma.cartridge.delete({
    where: {
      id: parsed.data.id,
      userId: BigInt(parsed.data.id),
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
