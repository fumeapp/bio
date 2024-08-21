import { beforeAll, describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { actingAs, setupUsers, userFromEmail } from './auth'
import { setupConfig } from './config'
import { penColors } from '~/utils/shared'
import type { MetapiResponse } from '~/types/metapi'
import type { Pen } from '~/types/models'

beforeAll(setupUsers)
describe('/api/pen', async () => {
  await setup(setupConfig())

  const pens: Pen[] = []

  it('post /api/pen - create a pen', async () => {
    const { post } = await actingAs('test@test.com')
    const { data: pen } = await post('/api/pen', { color: penColors[0] }) as MetapiResponse<Pen>
    expect(pen.color).toBe(penColors[0])
    pens.push(pen)
    expect(pen.userId).toBe(userFromEmail('test@test.com').session.id.toString())
  })

  it(' get /api/pen - list all pens', async () => {
    const { get } = await actingAs('test@test.com')
    const response = await get('/api/pen') as MetapiResponse<Pen[]>
    expect(response.data[0]).toStrictEqual(pens[0])
  })

  it ('get /api/pen/:id - get a pen', async () => {
    const { get } = await actingAs('test@test.com')
    const response = await get(`/api/pen/${pens[0]?.id}`) as MetapiResponse<Pen>
    expect(response.data).toStrictEqual(pens[0])
  })

  it ('put /api/pen/:id - update a pen', async () => {
    const { put } = await actingAs('test@test.com')
    const { data: pen } = await put(`/api/pen/${pens[0]?.id}`, { color: penColors[1] }) as MetapiResponse<Pen>
    expect(pen.color).toBe(penColors[1])
  })
})
