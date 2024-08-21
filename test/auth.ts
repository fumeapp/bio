import { $fetch } from '@nuxt/test-utils/e2e'
import type { User } from '~/types/models'
import { createUser } from '~~/server/utils/user'

const users = [
  {
    session: {} as User,
    cookie: '',
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
]

async function setupUsers() {
  await Promise.all(users.map(async (userData) => {
    userData.session = await createUser(userData, 'github', {})
  }))
}

async function userFromEmail(email: string) {
  const user = users.find(user => user.email === email)
  if (!user) throw new Error('User not found')
  return user
}

async function actingAs(email: string) {
  const user = users.find(user => user.email === email)
  if (!user) throw new Error('User not found')
  const { data } = await $fetch('/api/test/session', { method: 'POST', body: { id: user?.session?.id.toString(), hash: user?.session?.hash } })
  user.cookie = data.cookie[1].split(';')[0] as string
  const get = (url: string) => $fetch(url, { headers: { cookie: user.cookie as string } })
  const post = (url: string, params: object) => $fetch(url, { method: 'POST', body: params, headers: { cookie: user.cookie as string } })
  return { get, post }
}

export {
  users,
  setupUsers,
  actingAs,
}
