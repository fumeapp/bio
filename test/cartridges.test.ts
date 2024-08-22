import { setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'
import { actingAs } from './auth'
import { setupConfig } from './config'
import type { Cartridge } from '~/types/models'
import { cartridgeContents, cartridgeMgs, cartridgeMls } from '~/utils/shared'

describe ('/api/user/:user/cartridge admin-only apiResource', async () => {
  await setup(setupConfig())
  const cartridges: Cartridge[] = []
  it ('all routes should 404 for non-admin ', async () => {
    const { get, post, put, remove } = await actingAs('test@test.com')
    try { await get('/api/user/1/cartridge') }
    catch (error: any) { expect(error.response.status).toBe(404) }
    try { await post('/api/user/1/cartridge', { content: cartridgeContents[0], ml: cartridgeMls[0], mg: cartridgeMgs[0] }) }
    catch (error: any) { expect(error.response.status).toBe(404) }
    try { await put('/api/user/1/cartridge/1', { cartridgeId: null }) }
    catch (error: any) { expect(error.response.status).toBe(404) }
    try { await remove('/api/user/1/cartridge/1') }
    catch (error: any) { expect(error.response.status).toBe(404) }
  })

  it ('post /api/user/:user/cartridge - create a cartridge', async () => {
    const { post } = await actingAs('admin@test.com')
    const { data: cartridge } = await post<Cartridge>('/api/user/1/cartridge', {
      content: cartridgeContents[0],
      ml: cartridgeMls[0],
      mg: cartridgeMgs[0],
    })
    expect(cartridge.content).toBe(cartridgeContents[0])
    expect(`${cartridge.ml}.0`).toBe(cartridgeMls[0])
    expect(cartridge.mg).toBe(cartridgeMgs[0])
    expect(cartridge.userId).toBe('1')
    cartridges.push(cartridge)
  })

  it ('get /api/user/:user/cartridge - list all cartridges', async () => {
    const { get } = await actingAs('admin@test.com')
    const response = await get<Cartridge[]>('/api/user/1/cartridge')
    expect(response.data[0]).toStrictEqual(cartridges[0])
  })

  it ('get /api/user/:user/cartridge/:id - get a cartridge', async () => {
    const { get } = await actingAs('admin@test.com')
    const { data: cartridge } = await get<Cartridge>(`/api/user/1/cartridge/${cartridges[0]?.id}`)
    expect(cartridge.id).toBe(cartridges[0]?.id.toString())
  })

  it ('delete /api/user/:user/cartridge/:id - delete a cartridge', async () => {
    if (!cartridges[0]) throw new Error('Cartridge not found')
    const { remove, get } = await actingAs('admin@test.com')

    await remove<Cartridge>(`/api/user/1/cartridge/${cartridges[0]?.id}`)
    try { await get<Cartridge[]>(`/api/user/1/cartridge/${cartridges[0]?.id}`) }
    catch (error: any) { expect(error.response.status).toBe(404) }
  })
})
