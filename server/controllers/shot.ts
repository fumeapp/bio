import type { H3Event } from 'h3'
import { z } from 'zod'
import { shot as policies } from '../policies/shot'
import { include, orderBy } from '../models/pen'
import type { Shot, User } from '~/types/models'

const index = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.index, { authed, user })
  return metapi().render(
    await prisma.shot.findMany({
      where: {
        userId: user.id,
      },
      orderBy,
      include,
    },
    ),
  )
}

const create = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.create, { authed, user })
  const schema = z.object({
    cartridgeId: z.number(),
    units: z.number(),
    date: z.string().datetime(),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  const shot = await prisma.shot.create({
    data: {
      cartridgeId: parsed.data.cartridgeId,
      userId: user.id,
      units: parsed.data.units,
      date: new Date(parsed.data.date),
    },
    include,
  })

  return metapi().success('shot logged', shot)
}

const remove = async ({ user, shot }: { user: User, shot: Shot }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.remove, { authed, shot })
  await prisma.shot.delete({
    where: { id: shot.id, userId: user.id },
  })
  return metapi().success('shot deleted')
}

export default {
  index,
  create,
  remove,
}
