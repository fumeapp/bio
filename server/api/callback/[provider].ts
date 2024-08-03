import { Issuer } from 'openid-client'
import type { OauthProvider } from '~/server/utils/oauth'

export default defineEventHandler(async (event) => {
  const provider = oauthProviders(useRuntimeConfig(event)).find((p: OauthProvider) => p.label === event.context.params?.provider)
  if (!provider) return metapi.init().error(event, 'Provider not supported')

  const issuer = new Issuer(provider.issuer)

  const client = new issuer.Client({
    client_id: provider.id,
    client_secret: provider.secret,
    redirect_uris: [provider.callback],
  })
  return client.authorizationUrl()
})
