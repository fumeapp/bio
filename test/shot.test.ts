import { setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'
import { actingAs } from './auth'
import { setupConfig } from './config'
import type { Cartridge, Pen, Shot } from '~/types/models'

describe('/api/shot', async () => {
  await setup(setupConfig())
  const pens: Pen[] = []
  const cartridges: Cartridge[] = []
  const shots: Shot[] = []

  it('post /api/shot - create a shot', async () => {
    const { post, put, user } = await actingAs('test@test.com')
    const { data: pen } = await post<Pen>('/api/pen', { color: penColors[0] })
    const { data: cartridge } = await post<Cartridge>('/api/cartridge', {
      content: cartridgeContents[0],
      ml: cartridgeMls[0],
      mg: cartridgeMgs[0],
    })
    cartridges.push(cartridge)
    const updateResponse = await put<Pen>(`/api/pen/${pen.id}`, { cartridgeId: cartridge.id })
    pens.push(updateResponse.data)

    const { data: shot } = await post<Shot>('/api/shot', {
      cartridge: cartridge.id,
      units: shotUnits[0],
      date: new Date().toISOString(),
    })

    expect(shot.userId).toBe(user.session.id.toString())
    expect(shot.cartridgeId).toBe(cartridge.id.toString())
    expect(shot.units).toBe(shotUnits[0])
    shots.push(shot)
  })

  it('get /api/shot - list all shots', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Shot[]>('/api/shot')
    expect(response.data[0]?.userId).toBe(user.session.id.toString())
  })

  it ('delete /api/shot/:id - delete a shot', async () => {
    if (!shots[0]) throw new Error('Shot not found')
    const { remove, get } = await actingAs('test@test.com')
    await remove<Shot>(`/api/shot/${shots[0]?.id}`)
    try { await get<Shot[]>(`/api/shot/${shots[0]?.id}`) }
    catch (error: any) { expect(error.response.status).toBe(404) }
  })
})
