import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import type { D1Database } from '@nuxthub/core'
import type { EventHandlerRequest, H3Event } from 'h3'
import models from '../models/index'

export function useDB(event: H3Event<EventHandlerRequest>): D1Database {
  return event.context.cloudflare.env.DB as D1Database
}

let prismaClient: PrismaClient
export function usePrisma(event?: H3Event<EventHandlerRequest>) {
  if (!event || useRuntimeConfig().appEnv === 'test') {
    if (!prismaClient)
      prismaClient = new PrismaClient()
    return prismaClient
      .$extends(models.user.extend.payload)
      .$extends(models.user.extend.admin)
      .$extends(models.token.extend.client)
      .$extends(models.token.extend.location)
  }
  if (!prismaClient) {
    const adapter = new PrismaD1(useDB(event))
    prismaClient = new PrismaClient({ adapter })
  }
  return prismaClient
    .$extends(models.user.extend.payload)
    .$extends(models.user.extend.admin)
    .$extends(models.token.extend.client)
    .$extends(models.token.extend.location)
}
