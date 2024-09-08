import type { H3Event } from 'h3'
import type { User } from '~/types/models'
import { include } from '../models/user'
import { user as policies } from '../policies/user'

const index = async (_: any, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.index, { authed })
  return metapi().render(await usePrisma(event).user.findMany({ include }),
  )
}

const get = async ({ user }: { user: User }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.index, { authed })
  return metapi().render(user)
}

export default {
  index,
  get,
}
