import type { Round } from '@prisma/client'
import type { H3Event } from 'h3'
import { z } from 'zod'
import type { User } from '~/types/models'
import { range } from '~/utils/shared'
import { include, orderBy } from '../models/round'
import { round as policies } from '../policies/round'

const index = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.index, { authed, user })
  return metapi().render(
    await usePrisma(event).round.findMany({
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
    content: z.enum(range.contents as [string, ...string[]]),
    ml: z.number(),
    mg: z.number(),
    color: z.enum(range.colors as [string, ...string[]]),
    frequency: z.string(),
    portions: z.number(),
    date: z.string().datetime(),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)
  return metapi().success('round created', await usePrisma(event).round.create({
    data: {
      userId: user.id,
      content: parsed.data.content,
      ml: parsed.data.ml,
      mg: parsed.data.mg,
      color: parsed.data.color,
      frequency: parsed.data.frequency,
      portions: parsed.data.portions,
      date: parsed.data.date,
    },
    include,
  }))
}

const get = async ({ user, round }: { user: User, round: Round }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.get, { authed, user, round })
  return metapi().render(round)
}

const remove = async ({ user, round }: { user: User, round: Round }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.remove, { authed, round })

  await usePrisma(event).round.delete({
    where: {
      id: round.id,
      userId: user.id,
    },
  })
  return metapi().success('round deleted')
}

export default {
  index,
  create,
  get,
  remove,
}
