import { $fetch } from '@nuxt/test-utils/e2e'
import type { User, UserSession } from '~/types/models'
import { createUser } from '~~/server/utils/user'

const users = [
  {
    session: {} as User,
    cookie: undefined,
    email: 'test@test.com',
    name: 'Test User',
    avatar: 'https://avatars.githubusercontent.com/u/31337?v=4',
    payload: {
      roles: {
        admin: false,
      },
    },
  },
  {
    session: {} as User,
    cookie: undefined,
    email: 'admin@test.com',
    name: 'Admin User',
    avatar: 'https://avatars.githubusercontent.com/u/31337?v=4',
    payload: {
      roles: {
        admin: true,
      },
    },
  },
] as UserSession[]

async function userFromEmail(email: string): Promise<UserSession> {
  const index = users.findIndex(user => user.email === email)
  if (index === undefined) throw new Error(`User not found: ${email} - ${index}`)
  if (!users[index]) throw new Error('User not found')
  if (!users[index].session?.id)
    users[index].session = await createUser(users[index], 'github', {})
  return users[index]
}

async function actingAs(email: string) {
  const user = await userFromEmail(email)
  const { data } = await $fetch('/api/test/session', { method: 'POST', body: { id: user?.session?.id.toString(), hash: user?.session?.hash } })
  user.cookie = data.cookie[1].split(';')[0] as string
  const get = (url: string) => $fetch(url, { headers: { cookie: user.cookie as string } })
  const post = (url: string, params: object) => $fetch(url, { method: 'POST', body: params, headers: { cookie: user.cookie as string } })
  const put = (url: string, params: object) => $fetch(url, { method: 'PUT', body: params, headers: { cookie: user.cookie as string } })
  return { get, post, put }
}

export {
  users,
  actingAs,
  userFromEmail,
}
