import { PrismaClient } from '@prisma/client'
import models from '../models/index'

const prismaClientSingleton = () => {
  // return new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
}

/*
type ModelExtensions = {
  [ModelName in Lowercase<keyof PrismaClient>]?: {
    [MethodName: string]: (...args: any[]) => any
  };
}

function createExtendedPrismaClient(extensions: ModelExtensions = {}) {
  const prisma = new PrismaClient().$extends({
    model: Object.fromEntries(
      Object.entries(extensions).map(([modelName, modelExtension]) => [
        modelName,
        {
          ...modelExtension,
        },
      ]),
    ),
  })

  return prisma
}

const prisma = createExtendedPrismaClient();
*/

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
  .$extends(models.user.extend.admin)
  .$extends(models.token.extend.client)
  .$extends(models.token.extend.location)

export type CustomPrismaClient = ReturnType<typeof prismaClientSingleton>

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
