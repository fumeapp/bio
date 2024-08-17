import type { H3Event } from 'h3'
import type { User } from '~/types/models'

/**
 * eventHandler wrapper that requires the user to be authenticated with an option to also require user.isAdmin
 * @param handler
 * @param requireAdmin
 * @returns ({ user, event }: { user: User, event: H3Event }) => Promise<T>
 */
export function authedHandler<T>(handler: ({ user, event }: { user: User, event: H3Event }) => Promise<T>, requireAdmin = false) {
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
    if (requireAdmin && !user.isAdmin) return metapi().notFound(event)
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
   * Require the user to have user.isAdmin set to true
   * @default false
   */
  admin?: boolean
  /**
   * Bind the user to the model
   * @default true
   */
  bindUser?: boolean

  /**
   * Additional props to pass into findUnique
   * @default {}
   */
  props?: object
}

type BaseModelOptions = Omit<ModelOptions, 'authed' | 'admin' | 'bindUser'>

async function handleModelLookup(event: H3Event, options: ModelOptions, user?: User) {
  if (['PUT', 'DELETE'].includes(event.method) && event.context.params?._) {
    const parsed = event.context.params._.split('/')
    console.log('matchedRoute', event.context.matchedRoute.path)
    event.context.params.id = parsed[parsed.length - 1]
  }

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

  if (!modelDelegate?.findUnique)
    throw createError({ statusCode: 400, statusMessage: `Unable to find Prisma model: ${String(modelName)}` })

  let model

  if (user && options.bindUser)
    model = await modelDelegate.findUnique({
      where: {
        id: BigInt(event.context.params.id),
        userId: user.id,
        ...options.props,
      },
    })
  else
    model = await modelDelegate.findUnique({
      where: {
        id: BigInt(event.context.params.id),
        ...options.props,
      },
    })

  return model
}

function mergeOptions(options?: ModelOptions) {
  const defaultOptions = {
    authed: true,
    admin: false,
    bindUser: true,
    props: {},
  }

  return { ...defaultOptions, ...options }
}

export function modelHandler<T>(
  handler: ({ event, model }: { user?: User, event: H3Event, model: T }) => Promise<any>,
  options?: BaseModelOptions,
) {
  return defineEventHandler(async (event: H3Event) => {
    const model = await handleModelLookup(event, mergeOptions(options))
    return handler({ event, model })
  })
}

export function authedModelHandler<T>(
  handler: ({ user, event, model }: { user: User, event: H3Event, model: T }) => Promise<any>,
  options?: ModelOptions,
) {
  const mergedOptions = mergeOptions(options)

  return authedHandler(async ({ user, event }) => {
    const model = await handleModelLookup(event, mergedOptions, user)
    if (mergedOptions.admin && !user.isAdmin) return metapi().notFound(event)
    return handler({ user, event, model })
  })
}
