import type { Token, User } from '@prisma/client'
import type { RuntimeConfig } from 'nuxt/schema'

let token: Token & { user: User } | null = null

const set = async (hash: string): Promise<User> => {
  if (token?.user) return token.user
  token = await prisma.token.findUnique({
    where: {
      hash,
    },
    include: {
      user: true,
    },
  })
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
}
