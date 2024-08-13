import type { Token as PrismaToken, User as PrismaUser } from '@prisma/client'
import type { Cartridge as PrismaCartridge, Pen as PrismaPen, Shot as PrismaShot } from '@prisma/client'

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
  hash: string
}

export interface Shot extends PrismaShot {
  cartridge?: Cartridge
}

export interface Cartridge extends PrismaCartridge {
  pen?: Pen
  shots?: Shot[]
}

export interface Pen extends PrismaPen {
  cartridge?: Cartridge
}
