import type { Token, User } from '@prisma/client'
import type { RuntimeConfig } from 'nuxt/schema'

let session: Token | undefined

export const authSetUser = async (token: string): Promise<User> => {
  session = await prisma.token.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  })
  return session?.user as User
}

export const authVerifyToken = (cfg: RuntimeConfig, token?: string): boolean =>
  !!token && token.length === (65 + cfg.public.prefix.length)

export const authUser = (): User | undefined => session?.user
