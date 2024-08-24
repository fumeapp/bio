import { z } from 'zod'
import type { Token } from '~/types/models'

const index = authedHandler(async ({ user }) => {
  return metapi().render(
    await prisma.$extends({
      result: {
        token: {
          isCurrent: {
            needs: { hash: true },
            compute({ hash }) { return hash === user.hash },
          },
        },
      },
    }).token.findMany({
      where: {
        userId: user.id,
      },
    }),
  )
})

const get = authedModelHandler<Token>(async ({ user, event, model: token }) => {
  if (Number(token.userId) !== Number(user.id))
    return metapi().error(event, 'Unauthorized', 401)
  return metapi().renderNullError(event, token)
})

const remove = authedModelHandler<Token>(async ({ user, event, model: token }) => {
  if (token.userId !== user.id)
    return metapi().error(event, 'Unauthorized', 401)
  await prisma.token.delete({
    where: {
      id: token.id,
      userId: user.id,
    },
  })
  return metapi().success('token deleted')
})

export default {
  index,
  get,
  remove,
}
