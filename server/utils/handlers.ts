import type { H3Event, Router } from 'h3'
import type { User } from '~/types/models'

export function modelBind(router: Router) {
  return {
    get: (route: string, handler: Function) => {
      const parsedRoute = route.replace(/\{(\w+)\}/g, ':$1')
      const foundModels = route.match(/\{(\w+)\}/g)?.map(m => m.slice(1, -1)) || []

      console.log(parsedRoute, foundModels)

      router.get(parsedRoute, async (event: H3Event) => {
        const params = event.context.params
        const query = event.context.query
        return { params, query }
      })
    },
  }
}

/**
 * eventHandler wrapper that requires the user to be authenticated with an option to also require user.isAdmin
 * @param handler
 * @returns ({ user, event }: { user: User, event: H3Event }) => Promise<T>
 */
export function authedHandler<T>(handler: ({ user, event }: { user: User, event: H3Event }) => Promise<T>) {
  return defineEventHandler(async (event: H3Event) => {
    const { user } = await requireUserSession(event)
    try {
      const dbUser = await prisma.user.update({ where: { id: user.id }, data: { updatedAt: new Date() } }) as unknown as User
      await prisma.token.update({ where: { userId: user.id, hash: user.hash }, data: { updatedAt: new Date() } })
      dbUser.hash = user.hash
      await replaceUserSession(event, { user: dbUser })
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_error) {
      clearUserSession(event)
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    return handler({ user, event })
  })
}

interface ModelOptions {
  /**
   * Require the user to be authenticated - will then be passed through
   * @default true
   */
  authed?: boolean
  /**
   * Includes optional includes to the model lookup
   */
  include?: object
}

async function handleModelLookup(event: H3Event, include = {}) {
  if (
    !event.context?.params
    || !event.context.params.id
    || !event.context.matchedRoute
    || !event.context.matchedRoute.path
  )
    throw createError({ statusCode: 400, statusMessage: 'Invalid model Binding attempt' })

  const vals = event.context.matchedRoute.path.split('/')
  const modelName = vals[vals.length - 2] as keyof typeof prisma

  const modelDelegate = prisma[modelName as keyof typeof prisma] as any

  return await modelDelegate.findUnique({ where: { id: BigInt(event.context.params.id) }, include })
}

function mergeOptions(options?: ModelOptions) {
  const defaultOptions: ModelOptions = {
    authed: true,
    requireAdmin: false,
    include: {},
  }

  return { ...defaultOptions, ...options }
}

export function authedModelHandler<T>(
  handler: ({ user, event, model }: { user: User, event: H3Event, model: T }) => Promise<any>,
  options?: ModelOptions,
) {
  const mergedOptions = mergeOptions(options)
  return authedHandler(async ({ user, event }) => {
    const model = await handleModelLookup(event, mergedOptions.include)
    if (model === null || (mergedOptions.requireAdmin && !user.isAdmin)) return metapi().notFound(event)
    return handler({ user, event, model })
  })
}
