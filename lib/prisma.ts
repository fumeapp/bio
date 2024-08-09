import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // return new PrismaClient()
  return new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
