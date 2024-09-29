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

const me = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  try {
    const dbUser = await usePrisma(event).user.update({ where: { id: user.id }, data: { updatedAt: new Date() } }) as unknown as User
    dbUser.hash = user.hash
    await usePrisma(event).token.update({ where: { hash: user.hash, userId: user.id }, data: { updatedAt: new Date() } })
    await replaceUserSession(event, { user: dbUser })
    return metapi().render(dbUser)
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e) {
    console.log('why isnt this working')
    await clearUserSession(event)
  }
})

const logout = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  await usePrisma(event).token.delete({
    where: {
      userId: user.id,
      hash: user.hash,
    },
  })
  await clearUserSession(event)
  return metapi().success('logged out')
})

export default {
  index,
  get,
  me,
  logout,
}
