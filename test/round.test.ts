import type { Round } from '@prisma/client'
import { setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'
import { range } from '~/utils/shared'
import { actingAs } from './auth'

describe('/api/user/{user}/round', async () => {
  const rounds: Round[] = []
  await setup({ host: 'http://localhost:3000' })

  it('post /api/user/{user}/round - create a round', async () => {
    const { post, user } = await actingAs('test@test.com')
    const { data: round } = await post<Round>(`/api/user/${user.session.id}/round`, {
      date: new Date(),
      content: range.contents[0],
      ml: range.mls[0],
      mg: range.mgs[0],
      color: range.colors[0],
      frequency: 'weekly',
      portions: 4,
    })
    expect(round.content).toBe(range.contents[0])
    expect(round.ml).toBe(range.mls[0])
    expect(round.mg).toBe(range.mgs[0])
    expect(round.color).toBe(range.colors[0])
    expect(round.frequency).toBe('weekly')
    expect(round.portions).toBe(4)
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

  it('put /api/user/{user}/round/{round} - update a round', async () => {
    if (!rounds[0]) throw new Error('Round not found')
    const { put, user } = await actingAs('test@test.com')
    const updatedData = {
      date: rounds[0].date,
      content: range.contents[1],
      ml: range.mls[1],
      mg: range.mgs[1],
      color: range.colors[1],
      frequency: 'daily',
      portions: 2,
    }
    const { data: updatedRound } = await put<Round>(`/api/user/${user.session.id}/round/${rounds[0].id}`, updatedData)

    const { updatedAt: _1, ...roundWithoutUpdatedAt } = updatedRound
    const { updatedAt: _2, ...originalWithoutUpdatedAt } = rounds[0]

    expect(roundWithoutUpdatedAt).toStrictEqual({
      ...originalWithoutUpdatedAt,
      ...updatedData,
    })
  })

  it('delete /api/user/{user}/round/{round} - delete a round', async () => {
    if (!rounds[0]) throw new Error('Round not found')
    const { remove, notFound, user } = await actingAs('test@test.com')
    await remove<Round>(`/api/user/${user.session.id}/round/${rounds[0]?.id}`)
    expect(await notFound('GET', `/api/user/${user.session.id}/round/${rounds[0]?.id}`)).toBe(404)
  })
})
