import type { IssuerMetadata } from 'openid-client'
import type { H3Event } from 'h3'

export interface OauthProvider {
  label: string
  icon: string
  id?: string
  secret?: string
  issuer: IssuerMetadata
  callback?: string
}

export const oauthProviders = (cfg?: RuntimeConfig): OauthProvider[] => {
  return [
    {
      label: 'google',
      icon: 'i-logos-google-icon',
      id: cfg?.public?.googleClientId,
      secret: cfg?.private?.googleClientSecret,
      issuer: {
        authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_endpoint: 'https://oauth2.googleapis.com/token',
      },
      callback: `${cfg?.public?.url}/api/callback/google`,
    },
    {
      label: 'github',
      icon: 'i-logos-github-icon',
      id: cfg?.public?.githubClientId,
      secret: cfg?.private?.githubClientSecret,
      issuer: {
        authorization_endpoint: 'https://github.com/login/oauth/authorize',
        token_endpoint: 'https://github.com/login/oauth/access_token',
      },
      callback: `${cfg?.public?.url}/api/callback/github`,
    },
  ]
}
