import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { actingAs, setupUsers, users } from './auth'
import { setupConfig } from './config'
import type { MetapiResponse } from '~/types/metapi'
import type { User } from '~/types/models'

describe('/api/me and /api/user', async () => {
  await setupUsers()
  await setup(setupConfig())
  it('/api/me should 401', async () => {
    try { await $fetch('/api/me') }
    catch (error: any) {
      expect(error.response.status).toBe(401)
    }
  })

  it('get /api/me - current user session', async () => {
    const { get } = await actingAs('test@test.com')
    const response = await get('/api/me') as MetapiResponse<User>
    expect(response.data.email).toEqual(users[0]?.session.email)
  })

  it ('get /api/user isAdmin: false - 404', async () => {
    try {
      await (await actingAs('test@test.com')).get('/api/user')
    }
    catch (error: any) {
      expect(error.response.status).toBe(404)
    }
  })

  it ('get /api/user GET', async () => {
    const response = await (await actingAs('admin@test.com')).get('/api/user') as MetapiResponse<User[]>
    expect(response.data.length).toBe(2)
  })

  it ('get /api/user/:id', async () => {
    const response = await (await actingAs('admin@test.com')).get(`/api/user/${users[0]?.session.id}`) as MetapiResponse<User>
    expect(response.data.id).toBe(users[0]?.session.id.toString())
  })
})
