import { PrismaClient } from '@prisma/client'
import { tokenClient } from '~/utils/mutators/token'

const prismaClientSingleton = () => {
  // const client = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton().$extends(tokenClient)

export type CustomPrismaClient = ReturnType<typeof prismaClientSingleton>

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
