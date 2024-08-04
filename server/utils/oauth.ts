import { Issuer } from 'openid-client'
import type { H3Event } from 'h3'
import type { RuntimeConfig } from 'nuxt/schema'
import type { BaseClient, IssuerMetadata } from 'openid-client'
import type { GithubUserInfo, GoogleUserInfo, OauthProvider, UserInfo, UserPayload } from '~/types/oauth'

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
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
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

export const getUser = async (provider: OauthProvider, req: H3Event['node']['req']): Promise<UserPayload> => {
  const user = { payload: { oauth: {}, tokenSet: {} }, info: {} } as UserPayload
  const client = oauthClient(provider)
  const params = client.callbackParams(req)
  user.payload.tokenSet = provider.name === 'github'
    ? await client.oauthCallback(provider.callback, params)
    : await client.callback(provider.callback, params)

  if (provider.name === 'github') {
    user.payload.oauth = await client.userinfo(user.payload.tokenSet.access_token as string) as GithubUserInfo
    user.info.email = user.payload.oauth.email
    user.info.name = user.payload.oauth.name
    user.info.avatar = user.payload.oauth.avatar_url
  }
  else {
    user.payload.oauth = await client.userinfo(user.payload.tokenSet.access_token as string) as GoogleUserInfo
    user.info.email = user.payload.oauth.email
    user.info.name = `${user.payload.oauth.given_name} ${user.payload.oauth.family_name}`
    user.info.avatar = user.payload.oauth.picture
  }
  return user
}
