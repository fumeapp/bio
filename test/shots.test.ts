import { describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { actingAs } from './auth'
import { setupConfig } from './config'
import type { Cartridge, Pen, Shot } from '~/types/models'

describe('/api/user/:user/shot admin-only apiResource', async () => {
  await setup(setupConfig())
  const pens: Pen[] = []
  const cartridges: Cartridge[] = []
  const shots: Shot[] = []

  it('all routes should 404 for non-admin ', async () => {
    const { notFound, user } = await actingAs('test@test.com')
    expect(await notFound('GET', `/api/user/${user.session.id}/shot`)).toBe(404)
    expect(await notFound('POST', `/api/user/${user.session.id}/shot`)).toBe(404)
    expect(await notFound('DELETE', `/api/user/${user.session.id}/shot/1`)).toBe(404)
  })

  it('post /api/user/:user/shot - create a shot', async () => {
    const { post, put } = await actingAs('admin@test.com')
    const { user } = await actingAs('test@test.com')
    const { data: pen } = await post<Pen>(`/api/user/${user.session.id}/pen`, { color: penColors[0] })
    const { data: cartridge } = await post<Cartridge>(`/api/user/${user.session.id}/cartridge`, {
      content: cartridgeContents[0],
      ml: cartridgeMls[0],
      mg: cartridgeMgs[0],
    })
    cartridges.push(cartridge)
    const updateResponse = await put<Pen>(`/api/user/${user.session.id}/pen/${pen.id}`, { cartridgeId: cartridge.id })
    pens.push(updateResponse.data)
    const { data: shot } = await post<Shot>(`/api/user/${user.session.id}/shot`, {
      cartridge: cartridge.id,
      units: shotUnits[0],
      date: new Date().toISOString(),
    })
    expect(shot.userId).toBe(user.session.id.toString())
    expect(shot.cartridgeId).toBe(cartridge.id.toString())
    expect(shot.units).toBe(shotUnits[0])
    shots.push(shot)
  })
})
