import jwt from 'jsonwebtoken'

import { FetchError } from 'ofetch'

interface AppleConfig {
  clientId: string
  keyIdentifier: string
  teamId: string
  privateKey: string
  redirectURL: string
}

interface AppleTokenResponse {
  token_type: string
  expires_in: number
  refresh_token: string
  id_token: string
}

export interface RequestAccessTokenBody {
  grant_type: 'authorization_code'
  code: string
  redirect_uri: string
  client_id: string
  client_secret?: string
}

interface RequestAccessTokenOptions {
  body?: RequestAccessTokenBody
  params?: Record<string, string | undefined>
  headers?: Record<string, string>
}

interface AppleVerifiedToken {
  iss: string
  aud: string
  exp: number
  iat: number
  sub: string
  at_hash: string
  email: string
  email_verified: boolean
  auth_time: number
  nonce_supported: boolean
}

const getAuthURL = (config: AppleConfig): string => {
  const url = new URL('https://appleid.apple.com/auth/authorize')
  url.searchParams.append('client_id', config.clientId)
  url.searchParams.append('redirect_uri', config.redirectURL || 'https://25ef-2605-a601-a0ee-c700-c005-21af-aae4-cb22.ngrok-free.app/api/oauth/apple')
  url.searchParams.append('scope', 'openid email name')
  url.searchParams.append('response_type', 'code')
  url.searchParams.append('response_mode', 'form_post')
  return url.toString()
}

const getSecret = (config: AppleConfig) => {
  const timeNow = Math.floor(Date.now() / 1000)

  const claims = {
    iss: config.teamId,
    iat: timeNow,
    exp: timeNow + 300,
    aud: 'https://appleid.apple.com',
    sub: config.clientId,
  }
  const header = { alg: 'ES256', kid: config.keyIdentifier }
  const key = `-----BEGIN PRIVATE KEY-----
${config.privateKey.split(':BR:').join('\n')}
-----END PRIVATE KEY-----`

  return jwt.sign(claims, key, { algorithm: 'ES256', header })
}

// taken from nuxt-auth-utils until we can figure out how to import it
export async function requestAccessToken(url: string, options: RequestAccessTokenOptions): Promise<any> {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    ...options.headers,
  }

  const body = headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ? new URLSearchParams(options.body as unknown as Record<string, string> || options.params || {},
    ).toString()
    : options.body

  return $fetch(url, {
    method: 'POST',
    headers,
    body,
  }).catch((error) => {
    if (error instanceof FetchError && error.status === 401)
      return error.data

    throw error
  })
}

const getAuthToken = async (config: AppleConfig, code: string): Promise<AppleTokenResponse> => {
  return requestAccessToken('https://appleid.apple.com/auth/token', { params: {
    client_id: config.clientId,
    client_secret: getSecret(config),
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectURL,
  } })
}

const verifyIdToken = (idToken: string): AppleVerifiedToken => {
  return jwt.decode(idToken, {
    algorithm: 'RS256',
    issuer: 'https://appleid.apple.com',
  }) as unknown as AppleVerifiedToken
}

export const apple = {
  getAuthURL,
  getAuthToken,
  getSecret,
  verifyIdToken,
}
