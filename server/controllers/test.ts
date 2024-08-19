import type { User } from '~/types/models'

const create = defineEventHandler(async (event) => {
  const { id, hash } = await readBody(event)
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  }) as unknown as User

  user.hash = hash
  console.log('test.create', user)
  await setUserSession(event, { user })
  return metapi().success('test session created', { headers: event.node.res.getHeader('set-cookie') })
})

export default {
  create,
}
