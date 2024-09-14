import type { H3Event } from 'h3'
import { z } from 'zod'
import type { User, UserCycle } from '~/types/models'
import { cartridgeContents } from '~/utils/shared'
import { cycle as policies } from '../policies/cycle'

const create = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.create, { authed })
  const schema = z.object({
    content: z.enum(cartridgeContents as [string, ...string[]]),
    portions: z.number(),
    duration: z.string(),
    date: z.string().datetime(),
  })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 400)

  const payload = user.payload
  if (!payload.cycles)
    payload.cycles = []
  payload.cycles?.push(parsed.data)

  return metapi().success('cycle created', await usePrisma(event).user.update({
    data: {
      payload: JSON.stringify(payload),
    },
    where: {
      id: user.id,
    },
  }))
}
const remove = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.remove, { authed })
  return metapi().success('endpoint under constructino')
}

export default {
  create,
  remove,
}
