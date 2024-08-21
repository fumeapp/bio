import { beforeAll, describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { actingAs, setupUsers, users } from './auth'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

beforeAll(setupUsers)

function setupConfig() {
  if (process.env.DEVRUN === 'true' && !process.env.CI)
    return { host: 'http://localhost:3000' }
  else
    return {}
}

describe('/api/me', async () => {
  await setup(setupConfig())
  it('/api/me should 401', async () => {
    try { await $fetch('/api/me') }
    catch (error: any) {
      expect(error.response.status).toBe(401)
    }
  })

  it('/api/me returns the currently logged in user', async () => {
    const { get } = await actingAs('test@test.com')
    const response = await get('/api/me') as MetapiResponse<User>
    expect(response.data.email).toEqual(users[0]?.session.email)
  })

  it ('/api/user should 404 if a non-admin accesses it', async () => {
    try {
      await (await actingAs('test@test.com')).get('/api/user')
    }
    catch (error: any) {
      expect(error.response.status).toBe(404)
    }
  })

  it ('/api/use should return a list of all users if an admin accesses it', async () => {
    const response = await (await actingAs('admin@test.com')).get('/api/user') as MetapiResponse<User[]>
    expect(response.data.length).toBe(2)
  })
})
