import { Issuer } from 'openid-client'
import type { H3Event } from 'h3'
import type { RuntimeConfig } from 'nuxt/schema'
import type { BaseClient, IssuerMetadata } from 'openid-client'

export const oauthProviders = (cfg: RuntimeConfig): OauthProvider[] => {
  return [
    {
      name: 'google',
      id: cfg.public.googleClientId,
      secret: cfg.private.googleClientSecret,
      issuer: {
        issuer: 'https://accounts.google.com',
        authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_endpoint: 'https://oauth2.googleapis.com/token',
        jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
        userinfo_endpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
      },
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      callback: `${cfg.public.url}/api/callback/google`,
    },
    {
      name: 'github',
      id: cfg.public.githubClientId,
      secret: cfg.private.githubClientSecret,
      issuer: {
        issuer: 'https://github.com',
        authorization_endpoint: 'https://github.com/login/oauth/authorize',
        token_endpoint: 'https://github.com/login/oauth/access_token',
        jwks_uri: 'https://api.github.com/oauth/jwks',
        userinfo_endpoint: 'https://api.github.com/user',
      },
      scope: 'user:email',
      callback: `${cfg.public.url}/api/callback/github`,
    },
  ]
}

export const oauthProvider = (name: string | undefined, cfg: RuntimeConfig): OauthProvider | undefined => {
  return oauthProviders(cfg).find((p: OauthProvider) => p.name === name)
}

export const oauthClient = (provider: OauthProvider): BaseClient => {
  const issuer = new Issuer(provider.issuer)

  return new issuer.Client({
    client_id: provider.id,
    client_secret: provider.secret,
    redirect_uris: [provider.callback],
    response_types: ['code'],
  })
}

export const getUser = async (provider: OauthProvider, req: H3Event['node']['req']): Promise<UserInfo> => {
  const client = oauthClient(provider)
  const params = client.callbackParams(req)
  const tokenSet = provider.name === 'githuib' ? await client.oauthCallback(provider.callback, params) : await client.callback(provider.callback, params)
  const user = await client.userinfo(tokenSet.access_token as string)
  return user as UserInfo
}
