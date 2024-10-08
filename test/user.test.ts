import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'
import type { User } from '~/types/models'
import { actingAs } from './auth'

describe('/api/me and /api/user', async () => {
  await setup({ host: 'http://localhost:3000' })
  it('/api/me should 401', async () => {
    try {
      await $fetch('/api/me')
    }
    catch (error: any) { expect(error.response.status).toBe(401) }
  })

  it('get /api/me - current user session', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<User>('/api/me')
    expect(response.data.email).toEqual(user.session.email)
  })

  it ('get /api/all/user isAdmin: false - 404', async () => {
    const { unAuth } = await actingAs('test@test.com')
    expect(await unAuth('GET', '/api/all/user')).toBe(401)
  })

  it ('get /api/all/user GET', async () => {
    const response = await (await actingAs('admin@test.com')).get<User[]>('/api/all/user')
    expect(response.data.length).toBe(2)
  })

  it ('get /api/all/user/:id', async () => {
    const { user, get } = await actingAs('admin@test.com')
    const response = await get<User>(`/api/all/user/${user.session.id}`)
    expect(response.data.id).toBe(user.session.id)
  })
})
