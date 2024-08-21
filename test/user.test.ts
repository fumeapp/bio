import { beforeAll, describe, expect, it } from 'vitest'
import { $fetch, fetch, setup } from '@nuxt/test-utils/e2e'
import { createUser } from '~~/server/utils/user'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

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

beforeAll(async () => {
  await setupUsers()
})

async function setupDev() {
  if (process.env.DEVRUN === 'true')
    setup({ host: 'http://localhost:3000' })
  else
    setup()
}

async function setupUsers() {
  await Promise.all(users.map(async (userData) => {
    userData.session = await createUser(userData, 'github', {})
  }))
}

async function actingAs(email: string) {
  const user = users.find(user => user.email === email)
  if (!user) throw new Error('User not found')
  const { data } = await $fetch('/api/test/session', { method: 'POST', body: { id: user?.session?.id.toString(), hash: user?.session?.hash } })
  user.cookie = data.cookie[1].split(';')[0] as string
  const get = (url: string) => $fetch(url, { headers: { cookie: user.cookie as string } })
  return { get }
}

describe('/api/me', async () => {
  await setupDev()
  it('should 401', async () => {
    try { await $fetch('/api/me') }
    catch (error: any) {
      expect(error.response.status).toBe(401)
    }
  })

  it('returns the currently loggeed in user', async () => {
    const { get } = await actingAs('test@test.com')
    const response = await get('/api/me') as MetapiResponse<User>
    expect(response.data.email).toEqual(users[0]?.session.email)
  })
})

describe('/api/user', async () => {
  await setupDev()
  it ('should 404 if a non-admin accesses it', async () => {
    try {
      await (await actingAs('test@test.com')).get('/api/user')
    }
    catch (error: any) {
      expect(error.response.status).toBe(404)
    }
  })

  it ('should return a list of all users if an admin accesses it', async () => {
    const response = await (await actingAs('admin@test.com')).get('/api/user') as MetapiResponse<User[]>
    expect(response.data.length).toBe(2)
  })
})
