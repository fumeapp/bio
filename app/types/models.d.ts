import type { Token as PrismaToken } from '@prisma/client'
import type { Cartridge as PrismaCartridge } from '@prisma/client'

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
}

export interface Cartridge extends PrismaCartridge {
  pen?: Pen
}
