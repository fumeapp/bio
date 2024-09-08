import type { User } from '~/types/models'

const create = defineEventHandler(async (event) => {
  const { id, hash } = await readBody(event)
  const user = await usePrisma().user.findUnique({ where: { id: Number.parseInt(id) } }) as unknown as User

  user.hash = hash
  await setUserSession(event, { user })
  return metapi().success('test session created', { cookie: event.node.res.getHeader('set-cookie') })
})

export default {
  create,
}
