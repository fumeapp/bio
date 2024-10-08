import { $fetch } from '@nuxt/test-utils/e2e'
import { createUser } from '~~/server/utils/user'
import type { MetapiResponse } from '~/types/metapi'
import type { User, UserSession } from '~/types/models'

const users = [
  {
    session: {} as User,
    cookie: undefined,
    email: 'test@test.com',
    name: 'Test User',
    avatar: 'https://avatars.githubusercontent.com/u/31337?v=4',
    payload: {
      roles: {
        admin: false,
      },
    },
  },
  {
    session: {} as User,
    cookie: undefined,
    email: 'admin@test.com',
    name: 'Admin User',
    avatar: 'https://avatars.githubusercontent.com/u/31337?v=4',
    payload: {
      roles: {
        admin: true,
      },
    },
  },
] as UserSession[]

async function userFromEmail(email: string): Promise<UserSession> {
  const index = users.findIndex(user => user.email === email)
  if (index === undefined) throw new Error(`User not found: ${email} - ${index}`)
  if (!users[index]) throw new Error('User not found')
  if (!users[index].session?.id)
    users[index].session = await createUser(users[index], 'github', {})

  return users[index]
}

async function actingAs(email: string) {
  const user = await userFromEmail(email)
  const { data } = await $fetch('/api/test/session', { method: 'POST', body: { id: user?.session?.id.toString(), hash: user?.session?.hash } })
  user.cookie = data.cookie[1].split(';')[0] as string
  const get = <T>(url: string) => $fetch<MetapiResponse<T>>(url, { headers: { cookie: user.cookie as string } })
  const post = <T>(url: string, params: object) => $fetch<MetapiResponse<T>>(url, { method: 'POST', body: params, headers: { cookie: user.cookie as string } })
  const put = <T>(url: string, params: object) => $fetch<MetapiResponse<T>>(url, { method: 'PUT', body: params, headers: { cookie: user.cookie as string } })
  const remove = <T>(url: string, params?: object) => $fetch<MetapiResponse<T>>(url, { method: 'DELETE', body: params, headers: { cookie: user.cookie as string } })
  const expectStatus = async (expectedStatus: number, method: string, url: string, params?: object): Promise<number> => {
    try {
      await $fetch(url, { method, body: params, headers: { cookie: user.cookie as string } })
      throw new Error(`Expected ${expectedStatus} status for ${method}: ${url}, but request succeeded`)
    }
    catch (error) {
      if (error.response && error.response.status === expectedStatus)
        return expectedStatus
      throw error
    }
  }

  const notFound = (method: string, url: string, params?: object) => expectStatus(404, method, url, params)
  const unAuth = (method: string, url: string, params?: object) => expectStatus(401, method, url, params)

  return { get, post, put, remove, notFound, unAuth, user }
}

export {
  actingAs,
  userFromEmail,
  users,
}
