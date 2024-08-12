import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import type { H3Event } from 'h3'
import type { RuntimeConfig } from 'nuxt/schema'
import type { BaseClient } from 'openid-client'
import { Issuer } from 'openid-client'
import type { GithubUserInfo, GoogleUserInfo, MicrosoftUserInfo, OAuthPayload, OauthProvider } from '~/types/oauth'

export const oauthProviders = (cfg: RuntimeConfig): OauthProvider[] => {
  return [
    {
      name: 'google',
      id: cfg.public.googleClientId,
      secret: cfg.googleClientSecret,
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
      name: 'microsoft',
      id: cfg.public.microsoftClientId,
      secret: cfg.microsoftClientSecret,
      issuer: {
        issuer: 'https://login.microsoftonline.com/common',
        /*
        authorization_endpoint: 'https://login.live.com/oauth20_authorize.srf',
        token_endpoint: 'https://login.live.com/oauth20_token.srf',
        */
        authorization_endpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        token_endpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
        userinfo_endpoint: 'https://graph.microsoft.com/v1.0/me',
      },
      scope: 'User.Read',
      callback: `${cfg.public.url}/api/callback/microsoft`,
    },

    {
      name: 'github',
      id: cfg.public.githubClientId,
      secret: cfg.githubClientSecret,
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

export const getUser = async (provider: OauthProvider, req: H3Event['node']['req']): Promise<OAuthPayload> => {
  const user = { payload: { oauth: {}, tokenSet: {} }, info: {} } as OAuthPayload
  const client = oauthClient(provider)
  const params = client.callbackParams(req)
  user.payload.tokenSet = ['github', 'microsoft'].includes(provider.name)
    ? await client.oauthCallback(provider.callback, params)
    : await client.callback(provider.callback, params)

  if (provider.name === 'google') {
    user.payload.oauth = await client.userinfo(user.payload.tokenSet.access_token as string) as GoogleUserInfo
    user.info.email = user.payload.oauth.email
    user.info.name = user.payload.oauth.name
    user.info.avatar = user.payload.oauth.picture
  }

  if (provider.name === 'github') {
    user.payload.oauth = await client.userinfo(user.payload.tokenSet.access_token as string) as GithubUserInfo
    user.info.email = user.payload.oauth.email
    user.info.name = user.payload.oauth.name
    user.info.avatar = user.payload.oauth.avatar_url
  }

  if (provider.name === 'microsoft') {
    user.payload.oauth = await client.userinfo(user.payload.tokenSet.access_token as string) as MicrosoftUserInfo
    /*
    const result = await client.requestResource(
        `https://graph.microsoft.com/v1.0/users/${user.payload.oauth.userPrincipalName}/photo/$value`,
        user.payload.tokenSet.access_token,
    )
    if (result.body) await fs.promises.writeFile('avatar.jpg', Buffer.from(result.body, 'data'))
    */
    user.info.email = user.payload.oauth.userPrincipalName
    user.info.name = user.payload.oauth.displayName
    user.info.avatar = ''
  }

  return user
}
