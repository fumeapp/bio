import type { H3Event } from 'h3'
import { token as policies } from '../policies/token'
import type { Token } from '~/types/models'

const index = async (_: any, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  return metapi().render(
    await usePrisma(event).$extends({
      result: {
        token: {
          isCurrent: {
            needs: { hash: true },
            compute({ hash }) { return hash === authed.hash },
          },
        },
      },
    }).token.findMany({
      where: {
        userId: authed.id,
      },
    }),
  )
}

const get = async ({ token }: { token: Token }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.get, { authed, token })
  return metapi().render(token)
}

const remove = async ({ token }: { token: Token }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.remove, { authed, token })
  await usePrisma(event).token.delete({
    where: {
      id: token.id,
      userId: authed.id,
    },
  })
  return metapi().success('token deleted')
}

export default {
  index,
  get,
  remove,
}
