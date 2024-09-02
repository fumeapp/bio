import type { H3Event } from 'h3'
import { z } from 'zod'
import { cartridge as policies } from '../policies/cartridge'
import { include, orderBy } from '../models/cartridge'
import type { Cartridge, User } from '~/types/models'
import { cartridgeContents, cartridgeMgs, cartridgeMls } from '~/utils/shared'

const index = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.index, { authed, user })
  return metapi().render(
    await prisma.cartridge.findMany({
      where: { userId: user.id },
      include,
      orderBy,
    }),
  )
}

const create = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.create, { authed, user })
  const schema = z.object({
    content: z.enum(cartridgeContents as [string, ...string[]]),
    ml: z.enum(cartridgeMls as [string, ...string[]]),
    mg: z.enum(cartridgeMgs as [string, ...string[]]),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().success('cartridge created', await prisma.cartridge.create({
    data: {
      content: parsed.data.content,
      ml: parsed.data.ml,
      mg: parsed.data.mg,
      userId: user.id,
    },
    include,
  }))
}

const get = async ({ user, cartridge }: { user: User, cartridge: Cartridge }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.get, { authed, user, cartridge })
  return metapi().render(cartridge)
}

const update = async ({ user, cartridge }: { user: User, cartridge: Cartridge }, event: H3Event) => {
  authorize(policies.update, { user, cartridge })

  const schema = z.object({
    content: z.enum(cartridgeContents as [string, ...string[]]).optional(),
    ml: z.enum(cartridgeMls as [string, ...string[]]).optional(),
    mg: z.enum(cartridgeMgs as [string, ...string[]]).optional(),
  })

  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().success('cartridge updated', await prisma.cartridge.update({
    where: {
      id: cartridge.id,
      userId: user.id,
    },
    data: parsed.data,
    include,
  }))
}

const remove = async ({ user, cartridge }: { user: User, cartridge: Cartridge }, event: H3Event) => {
  authorize(policies.remove, { user, cartridge })

  await prisma.cartridge.delete({
    where: {
      id: cartridge.id,
      userId: user.id,
    },
  })
  return metapi().success('cartridge deleted')
}

export default {
  index,
  create,
  get,
  update,
  remove,
}
