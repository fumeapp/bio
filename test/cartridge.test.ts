import { describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { actingAs } from './auth'
import { setupConfig } from './config'
import type { Cartridge } from '~/types/models'

describe('/api/cartridge', async () => {
  await setup(setupConfig())

  const cartridges: Cartridge[] = []

  it('post /api/cartridge - create a cartridge', async () => {
    const { post, user } = await actingAs('test@test.com')
    const { data: cartridge } = await post<Cartridge>('/api/cartridge', {
      content: cartridgeContents[0],
      ml: cartridgeMls[0],
      mg: cartridgeMgs[0],
    })

    expect(cartridge.content).toBe(cartridgeContents[0])
    expect(`${cartridge.ml}.0`).toBe(cartridgeMls[0])
    expect(cartridge.mg).toBe(cartridgeMgs[0])
    expect(cartridge.userId).toBe(user.session.id.toString())
    cartridges.push(cartridge)
  })

  it('get /api/cartridge - list all cartridges', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Cartridge[]>('/api/cartridge')
    expect(response.data[0]?.userId).toBe(user.session.id.toString())
  })

  it('get /api/cartridge/:id - get a cartridge', async () => {
    const { get } = await actingAs('test@test.com')
    const response = await get<Cartridge>(`/api/cartridge/${cartridges[0]?.id}`)
    expect(response.data).toStrictEqual(cartridges[0])
  })

  it('delete /api/cartridge/:id - delete a cartridge', async () => {
    if (!cartridges[0]) throw new Error('Cartridge not found')
    const { remove, get } = await actingAs('test@test.com')
    await remove<Cartridge>(`/api/cartridge/${cartridges[0]?.id}`)
    try { await get<Cartridge[]>(`/api/cartridge/${cartridges[0]?.id}`) }
    catch (error: any) { expect(error.response.status).toBe(404) }
    console.log(cartridges)
  })
})
