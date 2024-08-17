// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { createUser } from '~~/server/utils/user'

const users = [
  {
    session: {},
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

describe('my test', async () => {
  await setup({ host: 'http://localhost:3000' })

  users.map(async (userData) => { userData.session = await createUser(userData, 'github', {}) })

  it('/api/me with no session should 401', async () => {
    try {
      await $fetch('/api/me')
    }
    catch (error: any) {
      expect(error.response.status).toBe(401)
    }
  })
  it('/api/me returns the currently loggeed in user', async () => {
    const { data: user } = await $fetch('/api/me')
    console.log(user)
  })
})
