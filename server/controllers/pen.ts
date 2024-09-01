import type { H3Event } from 'h3'
import { z } from 'zod'
import { pen as policies } from '../policies/pen'
import { include, orderBy } from '../models/pen'
import type { Pen, User } from '~/types/models'
import { penColors } from '~/utils/shared'

const index = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.index, { authed, user })
  return metapi().render(
    await prisma.pen.findMany({
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
    color: z.enum(penColors as [string, ...string[]]),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().success('pen created', await prisma.pen.create({
    data: {
      color: parsed.data.color,
      userId: user.id,
      cartridgeId: null,
    },
    include,
  }))
}

const get = async ({ user, pen }: { user: User, pen: Pen }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.get, { authed, user, pen })
  return metapi().render(pen)
}

const update = async ({ user, pen }: { user: User, pen: Pen }, event: H3Event) => {
  authorize(policies.update, { user, pen })

  const schema = z.object({
    color: z.enum(penColors as [string, ...string[]]),
    cartridgeId: z.number().optional(),
    shotDay: z.string().optional(),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse({
    cartridgeId: Number.parseInt(body?.cartridgeId) || undefined,
    color: body?.color || penColors[0],
    shotDay: body?.shotDay || undefined,
  })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().success('pen updated', await prisma.pen.update({
    where: {
      id: pen.id,
      userId: user.id,
    },
    data: {
      cartridgeId: parsed.data.cartridgeId ? parsed.data.cartridgeId : null,
      color: parsed.data.color,
      shotDay: parsed.data.shotDay || null,
    },
    include,
  }))
}
const remove = async ({ user, pen }: { user: User, pen: Pen }, event: H3Event) => {
  authorize(policies.remove, { user, pen })

  if (pen?.cartridgeId !== null)
    return metapi().error(event, 'Cannot delete pen with cartridge', 400)

  await prisma.pen.delete({
    where: {
      id: pen.id,
      userId: user.id,
    },
  })
  return metapi().success('pen deleted')
}

export default {
  index,
  create,
  get,
  update,
  remove,
}
