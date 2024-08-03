import { Issuer, IssuerMetadata } from 'openid-client'

interface Provider {
  label: string
  id: string
  secret: string
  issuer: IssuerMetadata
}

export default defineEventHandler(async (event) => {

  const cfg = useRuntimeConfig(event)

  const providers: Provider[] = [
    {
      label: 'google',
      id: cfg.public.googleClientId,
      secret: cfg.private.googleClientSecret,
      issuer: {
        authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_endpoint: 'https://oauth2.googleapis.com/token',
      }
    },
    {
      label: 'github',
      id: cfg.public.githubClientId,
      secret: cfg.private.githubClientSecret,
      issuer: {
        authorization_endpoint: 'https://github.com/login/oauth/authorize',
        token_endpoint: 'https://github.com/login/oauth/access_token',
      }
    },
  ]

  const provider = providers.find(p => p.label === event.context.params?.provider)

  if (!provider) return metapi.init().error(event, 'Provider not supported')

  const issuer = new Issuer(provider.issuer)

  const client = new issuer.Client({
    client_id: provider.id,
    client_secret: provider.secret,
    redirect_uris: [`${cfg.public.url}/api/callback/${provider.label}`],
  })
  return client.authorizationUrl()

})
