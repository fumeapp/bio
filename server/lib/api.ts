import type { H3Event, Router } from 'h3'
import models from '../models/index'

async function lookupModels<T extends Record<string, any>>(modelNames: (keyof T)[], event: H3Event): Promise<T> {
  const prisma = usePrisma(event)
  const result = {} as T

  for (const key of modelNames) {
    const modelDelegate = prisma[key as keyof typeof prisma] as any
    if (!modelDelegate)
      throw createError({ statusCode: 404, statusMessage: 'Not Found' })

    const id = event.context.params?.[`${String(key)}Id`]
    if (!id)
      throw createError({ statusCode: 404, statusMessage: 'Not Found' })

    const record = await modelDelegate.findUnique({
      where: { id: Number.parseInt(id, 10) },
      include: models[key as keyof typeof models]?.include || {},
    })
    if (!record)
      throw createError({ statusCode: 404, statusMessage: 'Not Found' })

    result[key] = record
  }

  return result
}

function bindModel(url: string): { url: string, modelNames: string[] } {
  const parts = url.split('/')
  const modelNames: string[] = []
  const urlParts = parts.map((part) => {
    if (part.startsWith('{') && part.endsWith('}')) {
      const modelName = part.slice(1, -1)
      modelNames.push(modelName)
      return `:${modelName}Id`
    }
    return part
  })
  return { url: urlParts.join('/'), modelNames }
}

function modelBoundHandler<T extends Record<string, any>>(
  modelNames: (keyof T)[],
  handler: (models: T, event: H3Event) => Promise<any>,
) {
  return defineEventHandler(async (event: H3Event) => {
    console.log('modelNames', modelNames)
    const boundModels = await lookupModels<T>(modelNames, event)
    return handler(boundModels, event)
  })
}

function getLastUrlSegment(url: string): string {
  const segments = url.split('/')
  return segments[segments.length - 1].replace(/[{}]/g, '')
}

function apiResource<T extends Record<string, any>>(
  router: Router,
  route: string,
  handlers: {
    index?: (models: T, event: H3Event) => Promise<any>
    create?: (models: T, event: H3Event) => Promise<any>
    get?: (models: T, event: H3Event) => Promise<any>
    update?: (models: T, event: H3Event) => Promise<any>
    remove?: (models: T, event: H3Event) => Promise<any>
  },
) {
  const modelName = getLastUrlSegment(route)

  if (handlers.index) {
    const { url: boundUrl, modelNames } = bindModel(route)
    router.get(boundUrl, modelBoundHandler<T>(modelNames as (keyof T)[], handlers.index))
  }

  if (handlers.create) {
    const { url: boundUrl, modelNames } = bindModel(route)
    router.post(boundUrl, modelBoundHandler<T>(modelNames as (keyof T)[], handlers.create))
  }

  if (handlers.get) {
    const { url: boundUrl, modelNames } = bindModel(`${route}/{${modelName}}`)
    router.get(boundUrl, modelBoundHandler<T>([...modelNames, modelName] as (keyof T)[], handlers.get))
  }
  if (handlers.update) {
    const { url: boundUrl, modelNames } = bindModel(`${route}/{${modelName}}`)
    router.put(boundUrl, modelBoundHandler<T>([...modelNames, modelName] as (keyof T)[], handlers.update))
  }

  if (handlers.remove) {
    const { url: boundUrl, modelNames } = bindModel(`${route}/{${modelName}}`)
    router.delete(boundUrl, modelBoundHandler<T>([...modelNames, modelName] as (keyof T)[], handlers.remove))
  }
}

export function withApiUtils(router: Router) {
  return {
    ...router,
    getBound: <T extends Record<string, any>>(url: string, handler: (models: T, event: H3Event) => Promise<any>) => {
      const { url: boundUrl, modelNames } = bindModel(url)
      return router.get(boundUrl, modelBoundHandler<T>(modelNames as (keyof T)[], handler))
    },
    postBound: <T extends Record<string, any>>(url: string, handler: (models: T, event: H3Event) => Promise<any>) => {
      const { url: boundUrl, modelNames } = bindModel(url)
      return router.post(boundUrl, modelBoundHandler<T>(modelNames as (keyof T)[], handler))
    },
    putBound: <T extends Record<string, any>>(url: string, handler: (models: T, event: H3Event) => Promise<any>) => {
      const { url: boundUrl, modelNames } = bindModel(url)
      return router.put(boundUrl, modelBoundHandler<T>(modelNames as (keyof T)[], handler))
    },
    patchBound: <T extends Record<string, any>>(url: string, handler: (models: T, event: H3Event) => Promise<any>) => {
      const { url: boundUrl, modelNames } = bindModel(url)
      return router.patch(boundUrl, modelBoundHandler<T>(modelNames as (keyof T)[], handler))
    },
    deleteBound: <T extends Record<string, any>>(url: string, handler: (models: T, event: H3Event) => Promise<any>) => {
      const { url: boundUrl, modelNames } = bindModel(url)
      return router.delete(boundUrl, modelBoundHandler<T>(modelNames as (keyof T)[], handler))
    },
    apiResource: <T extends Record<string, any>>(url: string, handlers: {
      index?: (models: T, event: H3Event) => Promise<any>
      create?: (models: T, event: H3Event) => Promise<any>
      get?: (models: T, event: H3Event) => Promise<any>
      update?: (models: T, event: H3Event) => Promise<any>
      remove?: (models: T, event: H3Event) => Promise<any>
    }) => {
      return apiResource<T>(router, url, handlers)
    },
  }
}
