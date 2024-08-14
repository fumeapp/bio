import type { EventHandlerRequest, H3Event, Router } from 'h3'
import type { User } from '~/types/models'

interface ApiRoutes {
  index?: (event: H3Event<EventHandlerRequest>) => Promise<any>
  create?: (event: H3Event<EventHandlerRequest>) => Promise<any>
  get?: (event: H3Event<EventHandlerRequest>) => Promise<any>
  update?: (event: H3Event<EventHandlerRequest>) => Promise<any>
  remove?: (event: H3Event<EventHandlerRequest>) => Promise<any>
}

const authedEventHandler = (handler: ({ user, event }: { user: User, event: H3Event }) => Promise<any>) => {
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

const routeModelHandler = (model: string, handler: ({ user, event, mdl }: { user: User, event: H3Event, mdl: any }) => Promise<any>) => {
  return authedEventHandler(async ({ user, event }) => {
    if (!event.context?.params || !event.context.params[model])
      throw createError({ statusCode: 400, statusMessage: 'Invalid model Bindings' })

    const mdl = await prisma[model].findUnique({ where: { id: BigInt(event.context.params[model]) } })

    return handler({ user, event, mdl })
  })
}

const apiResource = (
  name: string,
  router: Router,
  routes: ApiRoutes,
) => {
  if (routes.index) router.get(`/${name}`, routes.index)
  if (routes.create) router.post(`/${name}`, routes.create)
  if (routes.get) router.get(`/${name}/:id`, routes.get)
  if (routes.update) router.put(`/${name}/:id`, routes.update)
  if (routes.remove) router.delete(`/${name}/:id`, routes.remove)
}

const routeParams = (event: H3Event, positions: any) => {
  const results = event.context?.params?._.split('/')
  if (event.context.params && results)
    for (const key in positions)
      event.context.params[key] = results[positions[key]]

  return event
}

export const routing = {
  apiResource,
  routeParams,
  authedEventHandler,
  routeModelHandler,
}
