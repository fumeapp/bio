import type { Token as PrismaToken, User as PrismaUser } from '@prisma/client'
import type { Round as PrismaRound } from '@prisma/client'
import type { UserInfo } from '~/types/oauth'

export interface Token extends PrismaToken {
  client: import('ua-parser-js').IResult
  isCurrent: boolean
  location: {
    city: string
    region: string
    country: string
    timezone: string
    countryName: string
  }
}

export interface UserPayload {
  roles?: {
    admin?: boolean
  }
}

export interface User extends PrismaUser {
  payload: UserPayload
  isAdmin: boolean
  cycles: UserCycle[]
  hash: string
}

export interface UserSession extends UserInfo {
  session: User
  cookie?: string
}

export interface Round extends PrismaRound {
  user: User
}
