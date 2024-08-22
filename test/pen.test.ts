import { describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { actingAs } from './auth'
import { setupConfig } from './config'
import { penColors } from '~/utils/shared'
import type { Pen } from '~/types/models'

describe('/api/pen', async () => {
  const pens: Pen[] = []
  await setup(setupConfig())

  it('post /api/pen - create a pen', async () => {
    const { post, user } = await actingAs('test@test.com')
    const { data: pen } = await post<Pen>('/api/pen', { color: penColors[0] })
    expect(pen.color).toBe(penColors[0])
    expect(pen.userId).toBe(user.session.id.toString())
    pens.push(pen)
  })

  it('get /api/pen - list all pens', async () => {
    const { get } = await actingAs('test@test.com')
    const response = await get<Pen[]>('/api/pen')
    expect(response.data[0]).toStrictEqual(pens[0])
  })

  it ('get /api/pen/:id - get a pen', async () => {
    const { get } = await actingAs('test@test.com')
    const response = await get<Pen>(`/api/pen/${pens[0]?.id}`)
    expect(response.data).toStrictEqual(pens[0])
  })

  it ('put /api/pen/:id - update a pen', async () => {
    const { put } = await actingAs('test@test.com')
    const { data: pen } = await put<Pen>(`/api/pen/${pens[0]?.id}`, { color: penColors[1] })
    expect(pen.color).toBe(penColors[1])
  })

  it ('delete /api/pen/:id - delete a pen', async () => {
    if (!pens[0]) throw new Error('Pen not found')
    const { remove, get } = await actingAs('test@test.com')
    await remove<Pen>(`/api/pen/${pens[0]?.id}`)
    try { await get<Pen[]>(`/api/pen/${pens[0]?.id}`) }
    catch (error: any) { expect(error.response.status).toBe(404) }
  })
})
