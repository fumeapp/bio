import { PrismaClient } from '@prisma/client'
import { UAParser } from 'ua-parser-js'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton().$extends({
  name: 'tokenParser',
  result: {
    token: {
      client: {
        needs: {
          agent: true,
        },
        compute({ agent }) {
          return new UAParser(agent).getResult()
        },
      },
    },
  },
})

export type CustomPrismaClient = ReturnType<typeof prismaClientSingleton>

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
