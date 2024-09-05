import type { CfProperties, ExecutionContext, Request } from '@cloudflare/workers-types'
import { KVNamespace } from '@cloudflare/workers-types'

declare module 'h3' {
  interface H3EventContext {
    cf: CfProperties
    cloudflare: {
      request: Request
      env: Env
      context: ExecutionContext
    }
  }
}
