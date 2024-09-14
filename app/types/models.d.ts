import type { Token as PrismaToken, User as PrismaUser } from '@prisma/client'
import type { Cartridge as PrismaCartridge, Pen as PrismaPen, Shot as PrismaShot } from '@prisma/client'
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

export interface UserCycle {
  content: string // Tirzepatide
  portions: number // 4
  duration: string // weekly
  date: string
}

export interface UserPayload {
  roles?: {
    admin?: boolean
  }
  cycles?: UserCycle[]
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

export interface Shot extends PrismaShot {
  cartridge?: Cartridge
}

export interface Cartridge extends PrismaCartridge {
  pen?: Pen
  shots?: Shot[]
}

export interface Pen extends PrismaPen {
  cartridge: Cartridge | null
}
