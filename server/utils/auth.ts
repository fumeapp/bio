import type { Token, User } from '@prisma/client'
import type { RuntimeConfig } from 'nuxt/schema'

let token: Token & { user: User } | null = null

export const authSetUser = async (hash: string): Promise<User> => {
  token = await prisma.token.findUnique({
    where: {
      token: hash,
    },
    include: {
      user: true,
    },
  })
  return token?.user as User
}

export const authVerifyToken = (cfg: RuntimeConfig, token?: string): boolean =>
  !!token && token.length === (65 + cfg.public.prefix.length)

export const isAuthed = (): boolean => !!token

export const authUser = (): User => token?.user as User

export const authToken = (): string => token.token

export const authClearUser = (): void => {
  token = null
}
