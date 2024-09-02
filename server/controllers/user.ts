import type { H3Event } from 'h3'
import { include } from '../models/user'
import { user as policies } from '../policies/user'
import type { User } from '~/types/models'

const index = async (_: any, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.index, { authed })
  return metapi().render(await prisma.user.findMany({ include }),
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
