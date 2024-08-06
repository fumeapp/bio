import type { EventHandlerRequest, H3Event, Router } from 'h3'

interface ApiRoutes {
  index?: (event: H3Event<EventHandlerRequest>) => Promise<any>
  get?: (event: H3Event<EventHandlerRequest>) => Promise<any>
  update?: (event: H3Event<EventHandlerRequest>) => Promise<any>
  remove?: (event: H3Event<EventHandlerRequest>) => Promise<any>
}

const apiResource = (name: string, router: Router, routes: ApiRoutes) => {
  if (routes.index) router.get(`/${name}`, routes.index)
  if (routes.get) router.get(`/${name}/:id`, routes.get)
  if (routes.update) router.put(`/${name}/:id`, routes.update)
  if (routes.remove) router.delete(`/${name}/:id`, routes.remove)
}

export const routing = {
  apiResource,
}
