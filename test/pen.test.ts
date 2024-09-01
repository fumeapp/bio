import { describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { actingAs } from './auth'
import { setupConfig } from './config'
import { penColors } from '~/utils/shared'
import type { Pen } from '~/types/models'

describe('/api/user/{user}/pen', async () => {
  const pens: Pen[] = []
  await setup(setupConfig())

  it('post /api/user/{user}/pen - create a pen', async () => {
    const { post, user } = await actingAs('test@test.com')
    const { data: pen } = await post<Pen>(`/api/user/${user.session.id}/pen`, { color: penColors[0] })
    expect(pen.color).toBe(penColors[0])
    expect(pen.userId).toBe(user.session.id)
    pens.push(pen)
  })

  it('get /api/user/{user}/pen - list all pens', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Pen[]>(`/api/user/${user.session.id}/pen`)
    expect(response.data.find(p => p.id === pens[0]?.id)).toStrictEqual(pens[0])
  })

  it ('get /api/user/{user}/pen/{pen} - get a pen', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Pen>(`/api/user/${user.session.id}/pen/${pens[0]?.id}`)
    expect(response.data).toStrictEqual(pens[0])
  })

  it ('put /api/user/{user}/pen/{pen} - update a pen', async () => {
    const { put, user } = await actingAs('test@test.com')
    const { data: pen } = await put<Pen>(`/api/user/${user.session.id}/pen/${pens[0]?.id}`, { color: penColors[1] })
    expect(pen.color).toBe(penColors[1])
  })

  it ('delete /api/user/{user}/pen/{pen} - delete a pen', async () => {
    if (!pens[0]) throw new Error('Pen not found')
    const { remove, notFound, user } = await actingAs('test@test.com')
    await remove<Pen>(`/api/user/${user.session.id}/pen/${pens[0]?.id}`)
    expect(await notFound('GET', `/api/user/${user.session.id}/pen/${pens[0]?.id}`)).toBe(404)
  })
})
