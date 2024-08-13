import type { H3Event } from 'h3'
import type { Token } from '@prisma/client'
import type { RuntimeConfig } from 'nuxt/schema'
import type { User } from '~/types/models'

let token: Token & { user: User } | null = null

const bearer = (event: H3Event): string | undefined =>
  (event.node.req.headers.authentication as string)?.split(' ')[1] || undefined

const set = async (hash: string): Promise<User> => {
  // if (token?.user) return token.user
  token = await prisma.token.findUnique({
    where: {
      hash,
    },
    include: {
      user: true,
    },
  }) as (Token & { user: User }) | null
  return token?.user as User
}

const verify = (cfg: RuntimeConfig, token?: string): boolean =>
  !!token && token.length === (65 + cfg.public.prefix.length)

const isAuth = (): boolean => !!token

const user = (): User => token?.user as User

const hash = (): string | undefined => token?.hash

const clear = (): void => {
  token = null
}

export const auth = {
  set,
  verify,
  isAuth,
  user,
  hash,
  clear,
  bearer,
}
