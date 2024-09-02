import { describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { actingAs } from './auth'
import { setupConfig } from './config'
import { cartridgeContents, cartridgeMgs, cartridgeMls, penColors, shotUnits } from '~/utils/shared'
import type { Cartridge, Pen, Shot } from '~/types/models'

describe('/api/user/{user}/shot', async () => {
  const shots: Shot[] = []
  await setup(setupConfig())

  it('post /api/user/{user}/shot - create a shot', async () => {
    const { post, put, user } = await actingAs('test@test.com')

    // Create a pen and cartridge first
    const { data: pen } = await post<Pen>(`/api/user/${user.session.id}/pen`, { color: penColors[0] })
    const { data: cartridge } = await post<Cartridge>(`/api/user/${user.session.id}/cartridge`, {
      content: cartridgeContents[0],
      ml: cartridgeMls[0],
      mg: cartridgeMgs[0],
    })
    await put<Pen>(`/api/user/${user.session.id}/pen/${pen.id}`, { cartridgeId: cartridge.id })

    const { data: shot } = await post<Shot>(`/api/user/${user.session.id}/shot`, {
      cartridgeId: cartridge.id,
      units: shotUnits[0],
      date: new Date().toISOString(),
    })
    expect(shot.userId).toBe(user.session.id)
    expect(shot.cartridgeId).toBe(cartridge.id)
    expect(shot.units).toBe(shotUnits[0])
    shots.push(shot)
  })

  it('get /api/user/{user}/shot - list all shots', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Shot[]>(`/api/user/${user.session.id}/shot`)
    const result = response.data.find(s => s.id === shots[0]?.id)
    expect(result).toStrictEqual(shots[0])
  })

  it ('delete /api/user/{user}/shot/{shot} - delete a shot', async () => {
    if (!shots[0]) throw new Error('Shot not found')
    const { remove, notFound, user } = await actingAs('test@test.com')
    await remove<Shot>(`/api/user/${user.session.id}/shot/${shots[0]?.id}`)
    expect(await notFound('GET', `/api/user/${user.session.id}/shot/${shots[0]?.id}`)).toBe(404)
  })
})
