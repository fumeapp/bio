import type { Round } from '@prisma/client'
import { setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'
import { cartridgeContents, cartridgeMgs, cartridgeMls, penColors } from '~/utils/shared'
import { actingAs } from './auth'

describe('/api/user/{user}/round', async () => {
  const rounds: Round[] = []
  await setup({ host: 'http://localhost:3000' })

  it('post /api/user/{user}/round - create a round', async () => {
    const { post, user } = await actingAs('test@test.com')
    const { data: round } = await post<Round>(`/api/user/${user.session.id}/round`, {
      content: cartridgeContents[0],
      ml: cartridgeMls[0],
      mg: cartridgeMgs[0],
      color: penColors[0],
      frequency: 'daily',
      duration: '1 week',
      portions: 1,
    })
    expect(round.content).toBe(cartridgeContents[0])
    expect(`${round.ml}.0`).toBe(cartridgeMls[0])
    expect(round.mg).toBe(cartridgeMgs[0])
    expect(round.color).toBe(penColors[0])
    expect(round.frequency).toBe('daily')
    expect(round.duration).toBe('1 week')
    expect(round.portions).toBe(1)
    expect(round.userId).toBe(user.session.id)
    rounds.push(round)
  })

  it('get /api/user/{user}/round - list all rounds', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Round[]>(`/api/user/${user.session.id}/round`)
    expect(response.data.find(c => c.id === rounds[0]?.id)).toStrictEqual(rounds[0])
  })

  it('get /api/user/{user}/round/{round} - get a round', async () => {
    const { get, user } = await actingAs('test@test.com')
    const response = await get<Round>(`/api/user/${user.session.id}/round/${rounds[0]?.id}`)
    expect(response.data).toStrictEqual(rounds[0])
  })

  // Remove the 'put' test as there's no 'update' method in the controller

  it('delete /api/user/{user}/round/{round} - delete a round', async () => {
    if (!rounds[0]) throw new Error('Round not found')
    const { remove, notFound, user } = await actingAs('test@test.com')
    await remove<Round>(`/api/user/${user.session.id}/round/${rounds[0]?.id}`)
    expect(await notFound('GET', `/api/user/${user.session.id}/round/${rounds[0]?.id}`)).toBe(404)
  })
})
