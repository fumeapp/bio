import { describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { actingAs } from './auth'
import { setupConfig } from './config'
import { cartridgeContents, cartridgeMgs, cartridgeMls } from '~/utils/shared'
import type { Cartridge } from '~/types/models'

describe('/api/user/{user}/cartridge', async () => {
  const cartridges: Cartridge[] = []
  await setup(setupConfig())

  it('post /api/user/{user}/cartridge - create a cartridge', async () => {
    const { post, user } = await actingAs('test@test.com')
    const { data: cartridge } = await post<Cartridge>(`/api/user/${user.session.id}/cartridge`, {
      content: cartridgeContents[0],
      ml: cartridgeMls[0],
      mg: cartridgeMgs[0],
    })
    expect(cartridge.content).toBe(cartridgeContents[0])
    expect(`${cartridge.ml}.0`).toBe(cartridgeMls[0])
    expect(cartridge.mg).toBe(cartridgeMgs[0])
    expect(cartridge.userId).toBe(user.session.id)
    cartridges.push(cartridge)
  })

  it('get /api/user/{user}/cartridge - list all cartridges', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Cartridge[]>(`/api/user/${user.session.id}/cartridge`)
    expect(response.data.find(c => c.id === cartridges[0]?.id)).toStrictEqual(cartridges[0])
  })

  it('get /api/user/{user}/cartridge/{cartridge} - get a cartridge', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Cartridge>(`/api/user/${user.session.id}/cartridge/${cartridges[0]?.id}`)
    expect(response.data).toStrictEqual(cartridges[0])
  })

  it('put /api/user/{user}/cartridge/{cartridge} - update a cartridge', async () => {
    const { put, user } = await actingAs('test@test.com')
    const { data: cartridge } = await put<Cartridge>(`/api/user/${user.session.id}/cartridge/${cartridges[0]?.id}`, {
      content: cartridgeContents[1],
      ml: cartridgeMls[1],
      mg: cartridgeMgs[1],
    })
    expect(cartridge.content).toBe(cartridgeContents[1])
    expect(`${cartridge.ml}.0`).toBe(cartridgeMls[1])
    expect(cartridge.mg).toBe(cartridgeMgs[1])
  })

  it('delete /api/user/{user}/cartridge/{cartridge} - delete a cartridge', async () => {
    if (!cartridges[0]) throw new Error('Cartridge not found')
    const { remove, notFound, user } = await actingAs('test@test.com')
    await remove<Cartridge>(`/api/user/${user.session.id}/cartridge/${cartridges[0]?.id}`)
    expect(await notFound('GET', `/api/user/${user.session.id}/cartridge/${cartridges[0]?.id}`)).toBe(404)
  })
})
