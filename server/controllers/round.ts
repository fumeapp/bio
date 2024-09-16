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

const roundSchema = z.object({
  content: z.enum(range.contents as [string, ...string[]]),
  ml: z.number(),
  mg: z.number(),
  color: z.enum(range.colors as [string, ...string[]]),
  frequency: z.string(),
  portions: z.number(),
  date: z.string().datetime(),
})

const create = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.create, { authed, user })

  const parsed = roundSchema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)

  return metapi().success('round created', await usePrisma(event).round.create({
    data: {
      userId: user.id,
      ...parsed.data,
    },
    include,
  }))
}

const update = async ({ user, round }: { user: User, round: Round }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.update, { authed, round })

  const parsed = roundSchema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)

  return metapi().success('round updated', await usePrisma(event).round.update({
    where: {
      id: round.id,
      userId: user.id,
    },
    data: parsed.data,
    include,
  }))
}

const get = async ({ user, round }: { user: User, round: Round }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.get, { authed, user, round })
  return metapi().render(round)
}

const remove = async ({ user, round }: { user: User, round: Round }, event: H3Event) => {
  console.log('round.remove')
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

const all = defineEventHandler(async (event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.all, { authed })

  return metapi().render(
    await usePrisma(event).round.findMany({
      include,
      orderBy,
    }),
  )
})

export default {
  index,
  create,
  update,
  get,
  remove,
  all,
}
