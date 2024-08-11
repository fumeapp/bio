import { PrismaClient } from '@prisma/client'
import user from './mutators/user'

const prismaClientSingleton = () => {
  // return new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
}
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton().$extends(user.admin)
/*
for (const key in mutators)
  if (Object.prototype.hasOwnProperty.call(mutators, key))
    if (typeof mutators[key] === 'function')
      console.log(mutators[key]
*/

export type CustomPrismaClient = ReturnType<typeof prismaClientSingleton>

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
