import { setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'
import { actingAs } from './auth'
import { setupConfig } from './config'
import type { Pen } from '~/types/models'

describe ('/api/user/:user/pen admin-only apiResource', async () => {
  await setup(setupConfig())

  const pens: Pen[] = []
  it ('all routes should 404 for non-admin ', async () => {
    const { notFound } = await actingAs('test@test.com')
    expect(await notFound('GET', '/api/user/1/pen')).toBe(404)
    expect(await notFound('POST', '/api/user/1/pen')).toBe(404)
    expect(await notFound('PUT', '/api/user/1/pen/1')).toBe(404)
    expect(await notFound('DELETE', '/api/user/1/pen/1')).toBe(404)
  })

  it ('post /api/user/:user/pen - create a pen', async () => {
    const { post } = await actingAs('admin@test.com')
    const { data: pen } = await post<Pen>('/api/user/1/pen', { color: penColors[0] })
    expect(pen.color).toBe(penColors[0])
    expect(pen.userId).toBe('1')
    pens.push(pen)
  })

  it ('get /api/user/:user/pen - list all pens', async () => {
    const { get } = await actingAs('admin@test.com')
    const response = await get<Pen[]>('/api/user/1/pen')
    expect(response.data[0]).toStrictEqual(pens[0])
  })

  it ('get /api/user/:user/pen/:id - get a pen', async () => {
    const { get } = await actingAs('admin@test.com')
    const { data: pen } = await get<Pen>(`/api/user/1/pen/${pens[0]?.id}`)
    expect(pen.id).toBe(pens[0]?.id.toString())
  })

  it ('remove /api/user/:user/pen/:id - delete a pen', async () => {
    if (!pens[0]) throw new Error('Pen not found')
    const { remove, notFound } = await actingAs('admin@test.com')
    await remove<Pen>(`/api/user/1/pen/${pens[0]?.id}`)
    expect(await notFound('GET', `/api/user/1/pen/${pens[0]?.id}`)).toBe(404)
  })
})
