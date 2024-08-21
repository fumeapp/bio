import { beforeAll, describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { actingAs, setupUsers, users } from './auth'
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
    expect(pen.userId).toBe(users[0]?.session.id.toString())
    pens.push(pen)
  })
})
