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
    const { notFound } = await actingAs('test@test.com')
    expect(await notFound('GET', '/api/user/1/cartridge')).toBe(404)
    expect(await notFound('POST', '/api/user/1/cartridge', { content: cartridgeContents[0], ml: cartridgeMls[0], mg: cartridgeMgs[0] })).toBe(404)
    expect(await notFound('DELETE', '/api/user/1/cartridge/1')).toBe(404)
  })

  it ('post /api/user/:user/cartridge - create a cartridge', async () => {
    const { post, user } = await actingAs('admin@test.com')
    const { data: cartridge } = await post<Cartridge>(`/api/user/${user.session.id}/cartridge`, {
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

  it ('get /api/user/:user/cartridge - list all cartridges', async () => {
    const { get, user } = await actingAs('admin@test.com')
    const response = await get<Cartridge[]>(`/api/user/${user.session.id}/cartridge`)
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
